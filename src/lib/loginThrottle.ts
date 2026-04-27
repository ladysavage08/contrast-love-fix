// Client-side login throttle. Tracks failed attempts per email in localStorage.
// NOTE: This is defense-in-depth only — server-side rate limiting is not yet
// available in this project. Real attackers can bypass localStorage; this
// primarily slows down casual brute-force from a single browser.

const KEY = "ecphd_login_attempts_v1";
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

type Record = { count: number; firstAt: number; lockedUntil?: number };
type Store = Record & { email: string };

function read(): Store[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Store[];
  } catch {
    return [];
  }
}

function write(records: Store[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    /* ignore */
  }
}

function normalize(email: string) {
  return email.trim().toLowerCase();
}

export function getLockoutRemainingMs(email: string): number {
  const e = normalize(email);
  const rec = read().find((r) => r.email === e);
  if (!rec?.lockedUntil) return 0;
  const remaining = rec.lockedUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

export function recordFailedAttempt(email: string): {
  locked: boolean;
  remainingMs: number;
} {
  const e = normalize(email);
  const records = read();
  const now = Date.now();
  let rec = records.find((r) => r.email === e);

  if (!rec || now - rec.firstAt > WINDOW_MS) {
    rec = { email: e, count: 1, firstAt: now };
  } else {
    rec.count += 1;
  }

  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOCKOUT_MS;
  }

  const next = records.filter((r) => r.email !== e);
  next.push(rec);
  write(next);

  return {
    locked: !!rec.lockedUntil && rec.lockedUntil > now,
    remainingMs: rec.lockedUntil ? rec.lockedUntil - now : 0,
  };
}

export function clearAttempts(email: string) {
  const e = normalize(email);
  write(read().filter((r) => r.email !== e));
}

export function formatRemaining(ms: number): string {
  const mins = Math.ceil(ms / 60000);
  return mins <= 1 ? "about 1 minute" : `about ${mins} minutes`;
}
