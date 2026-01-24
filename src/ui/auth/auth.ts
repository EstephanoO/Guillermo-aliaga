export type AuthUser = {
  id: "admin" | "guillermo";
  name: string;
  email: string;
  password: string;
  route: string;
};

const AUTH_STORAGE_KEY = "goberna-auth-user";

const USERS: AuthUser[] = [
  {
    id: "admin",
    name: "Admin",
    email: "goberna@admin.com",
    password: "admin123",
    route: "/admin",
  },
  {
    id: "guillermo",
    name: "Guillermo",
    email: "guillermo@goberna.com",
    password: "goberna123",
    route: "/guillermo",
  },
];

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const getAuthUsers = () => USERS.slice();

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const storedId = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedId) return null;
  return USERS.find((user) => user.id === storedId) ?? null;
};

export const storeUser = (user: AuthUser) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, user.id);
};

export const clearStoredUser = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const authenticateUser = (email: string, password: string) => {
  const normalizedEmail = normalizeEmail(email);
  const user = USERS.find(
    (item) => item.email === normalizedEmail && item.password === password,
  );
  if (!user) return null;
  storeUser(user);
  return user;
};
