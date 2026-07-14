import type { Client, InArgs, InValue, ResultSet, Transaction } from "@libsql/client";
import { createClient } from "@libsql/client/web";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export type SqlArg = string | number | bigint | boolean | null | Uint8Array | undefined;
export type SqlArgs = InArgs;

export interface RunResult {
  lastInsertRowid: number;
  changes: number;
}

export interface AppStatement {
  run: (...args: unknown[]) => Promise<RunResult>;
  get: <T = Record<string, unknown>>(...args: unknown[]) => Promise<T | undefined>;
  all: <T = Record<string, unknown>>(...args: unknown[]) => Promise<T[]>;
}

export interface AppDb {
  mode: "local" | "turso";
  exec: (sql: string) => Promise<void>;
  prepare: (sql: string) => AppStatement;
  transaction: <T>(fn: (tx: AppDb) => Promise<T>) => Promise<T>;
}

function normalizeRows(result: ResultSet): Record<string, unknown>[] {
  return result.rows.map((row) => {
    const out: Record<string, unknown> = {};
    for (const col of result.columns) {
      const value = row[col];
      out[col] = typeof value === "bigint" ? Number(value) : value;
    }
    return out;
  });
}

function createLocalDb(filePath: string): AppDb {
  const sqlite = new Database(filePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  const wrap = (db: Database.Database): AppDb => ({
    mode: "local",
    async exec(sql: string) {
      db.exec(sql);
    },
    prepare(sql: string): AppStatement {
      const stmt = db.prepare(sql);
      return {
        async run(...args: unknown[]) {
          const info = stmt.run(...(args as SqlArg[]));
          return {
            lastInsertRowid: Number(info.lastInsertRowid),
            changes: info.changes,
          };
        },
        async get<T>(...args: unknown[]) {
          return stmt.get(...(args as SqlArg[])) as T | undefined;
        },
        async all<T>(...args: unknown[]) {
          return stmt.all(...(args as SqlArg[])) as T[];
        },
      };
    },
    async transaction<T>(fn: (tx: AppDb) => Promise<T>) {
      db.exec("BEGIN");
      try {
        const result = await fn(wrap(db));
        db.exec("COMMIT");
        return result;
      } catch (error) {
        try {
          db.exec("ROLLBACK");
        } catch {
          // ignore rollback errors
        }
        throw error;
      }
    },
  });

  return wrap(sqlite);
}

function createTursoDb(client: Client): AppDb {
  const make = (runner: {
    execute: (stmt: { sql: string; args?: SqlArgs }) => Promise<ResultSet>;
  }): AppDb => ({
    mode: "turso",
    async exec(sql: string) {
      // Split on semicolons carefully enough for our schema scripts
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const statement of statements) {
        await runner.execute({ sql: statement });
      }
    },
    prepare(sql: string): AppStatement {
      return {
        async run(...args: unknown[]) {
          const result = await runner.execute({ sql, args: args as SqlArgs });
          return {
            lastInsertRowid: Number(result.lastInsertRowid ?? 0),
            changes: result.rowsAffected ?? 0,
          };
        },
        async get<T>(...args: unknown[]) {
          const result = await runner.execute({ sql, args: args as SqlArgs });
          return normalizeRows(result)[0] as T | undefined;
        },
        async all<T>(...args: unknown[]) {
          const result = await runner.execute({ sql, args: args as SqlArgs });
          return normalizeRows(result) as T[];
        },
      };
    },
    async transaction<T>(fn: (tx: AppDb) => Promise<T>) {
      const tx = await client.transaction("write");
      try {
        const wrapped = make({
          execute: (stmt) => tx.execute(stmt),
        });
        const value = await fn(wrapped);
        await tx.commit();
        return value;
      } catch (error) {
        await tx.rollback();
        throw error;
      }
    },
  });

  return make({
    execute: (stmt) => client.execute(stmt),
  });
}

let cached: Promise<AppDb> | null = null;

export function isTursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

export async function openDb(): Promise<AppDb> {
  if (cached) return cached;

  cached = (async () => {
    if (isTursoConfigured()) {
      const client = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      });
      return createTursoDb(client);
    }

    const dataDir = process.env.VERCEL
      ? path.join("/tmp", "esteem-data")
      : path.join(/* turbopackIgnore: true */ process.cwd(), "data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    return createLocalDb(path.join(dataDir, "esteem.db"));
  })();

  return cached;
}

// Keep unused import type usage quiet for Transaction in older TS setups
export type { Transaction };
