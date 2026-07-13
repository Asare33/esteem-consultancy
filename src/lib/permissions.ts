export type RoleKey =
  | "super_admin"
  | "administrator"
  | "rental_manager"
  | "inventory_officer"
  | "finance_officer"
  | "customer_service"
  | "event_coordinator";

export type Permission =
  | "dashboard.view"
  | "bookings.manage"
  | "rentals.manage"
  | "inventory.manage"
  | "payments.manage"
  | "gallery.manage"
  | "news.manage"
  | "reports.view"
  | "staff.manage";

const ROLE_PERMISSIONS: Record<RoleKey, Permission[]> = {
  super_admin: [
    "dashboard.view",
    "bookings.manage",
    "rentals.manage",
    "inventory.manage",
    "payments.manage",
    "gallery.manage",
    "news.manage",
    "reports.view",
    "staff.manage",
  ],
  administrator: [
    "dashboard.view",
    "bookings.manage",
    "rentals.manage",
    "inventory.manage",
    "payments.manage",
    "gallery.manage",
    "news.manage",
    "reports.view",
  ],
  rental_manager: ["dashboard.view", "rentals.manage", "inventory.manage", "reports.view"],
  inventory_officer: ["dashboard.view", "inventory.manage", "rentals.manage"],
  finance_officer: ["dashboard.view", "payments.manage", "rentals.manage", "reports.view"],
  customer_service: ["dashboard.view", "bookings.manage", "rentals.manage"],
  event_coordinator: ["dashboard.view", "bookings.manage", "gallery.manage"],
};

export function hasPermission(roleKey: string | undefined | null, permission: Permission): boolean {
  if (!roleKey) return true; // legacy admins retain full access
  const key = roleKey as RoleKey;
  const perms = ROLE_PERMISSIONS[key];
  if (!perms) return false;
  return perms.includes(permission);
}

export function getRolePermissions(roleKey: RoleKey): Permission[] {
  return ROLE_PERMISSIONS[roleKey] ?? [];
}
