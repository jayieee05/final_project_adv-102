import { storageGetItem, storageSetItem } from '@/lib/storage';
import type { User } from '@/types/user';

const KEY_USERS = 'finesse_auth_users';
const KEY_SESSIONS = 'finesse_auth_sessions';

type StoredUser = User & {
  passwordHash: string;
};

type SessionMap = Record<string, string>;

function hashPassword(password: string, email: string): string {
  const normalized = `${email.toLowerCase().trim()}:${password}`;
  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33) ^ normalized.charCodeAt(i);
  }
  return `djb2_${(hash >>> 0).toString(16)}`;
}

function createToken(): string {
  return `tok_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? 'user',
  };
}

async function readUsers(): Promise<StoredUser[]> {
  const raw = await storageGetItem(KEY_USERS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await storageSetItem(KEY_USERS, JSON.stringify(users));
}

async function readSessions(): Promise<SessionMap> {
  const raw = await storageGetItem(KEY_SESSIONS);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as SessionMap;
  } catch {
    return {};
  }
}

async function writeSessions(sessions: SessionMap): Promise<void> {
  await storageSetItem(KEY_SESSIONS, JSON.stringify(sessions));
}

async function ensureSeedUsers(): Promise<void> {
  const users = await readUsers();
  if (users.length > 0) return;

  const seeded: StoredUser[] = [
    {
      id: 1,
      name: 'Store Owner',
      email: 'owner@finesse.com',
      role: 'owner',
      passwordHash: hashPassword('owner123', 'owner@finesse.com'),
    },
    {
      id: 2,
      name: 'Demo User',
      email: 'demo@finesse.com',
      role: 'user',
      passwordHash: hashPassword('demo123', 'demo@finesse.com'),
    },
  ];
  await writeUsers(seeded);
}

export async function localSignup(
  name: string,
  email: string,
  password: string,
): Promise<{ success: true; user: User; token: string } | { success: false; error: string }> {
  await ensureSeedUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const users = await readUsers();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const nextId = users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) + 1;
  const newUser: StoredUser = {
    id: nextId,
    name: name.trim(),
    email: normalizedEmail,
    role: 'user',
    passwordHash: hashPassword(password, normalizedEmail),
  };

  users.push(newUser);
  await writeUsers(users);

  const token = createToken();
  const sessions = await readSessions();
  sessions[token] = String(newUser.id);
  await writeSessions(sessions);

  return { success: true, user: toPublicUser(newUser), token };
}

export async function localLogin(
  email: string,
  password: string,
): Promise<{ success: true; user: User; token: string } | { success: false; error: string }> {
  await ensureSeedUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const users = await readUsers();
  const match = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!match || match.passwordHash !== hashPassword(password, normalizedEmail)) {
    return { success: false, error: 'Invalid email or password' };
  }

  const token = createToken();
  const sessions = await readSessions();
  sessions[token] = String(match.id);
  await writeSessions(sessions);

  return { success: true, user: toPublicUser(match), token };
}

export async function localVerify(
  token: string,
): Promise<{ success: true; user: User } | { success: false }> {
  await ensureSeedUsers();
  const sessions = await readSessions();
  const userId = sessions[token];
  if (!userId) return { success: false };

  const users = await readUsers();
  const match = users.find((u) => String(u.id) === userId);
  if (!match) {
    delete sessions[token];
    await writeSessions(sessions);
    return { success: false };
  }

  return { success: true, user: toPublicUser(match) };
}

export async function localLogout(token: string): Promise<void> {
  const sessions = await readSessions();
  if (sessions[token]) {
    delete sessions[token];
    await writeSessions(sessions);
  }
}
