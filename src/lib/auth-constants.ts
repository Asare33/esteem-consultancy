export const ADMIN_COOKIE = "esteem_admin_token";
export const CUSTOMER_COOKIE = "esteem_customer_token";

/** @deprecated use ADMIN_COOKIE */
export const COOKIE_NAME = ADMIN_COOKIE;

export function getJwtSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET ?? "esteem-admin-jwt-secret-change-in-production"
  );
}

export function getCustomerJwtSecret() {
  return new TextEncoder().encode(
    process.env.CUSTOMER_JWT_SECRET ??
      process.env.JWT_SECRET ??
      "esteem-customer-jwt-secret-change-in-production"
  );
}
