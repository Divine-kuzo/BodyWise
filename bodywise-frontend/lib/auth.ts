import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userQueries } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: number;
  email: string;
  role: 'patient' | 'health_professional' | 'institutional_admin' | 'system_admin';
}

// generating JWT token
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// verifying JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// hashing the password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// authenticate
export async function authenticateUser(email: string, password: string) {
  const user = userQueries.getUserByEmail.get(email) as any;
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  if (!user.is_active) {
    return { success: false, message: 'Account is inactive' };
  }
  
  const isPasswordValid = await comparePassword(password, user.password_hash);
  
  if (!isPasswordValid) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  
  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.is_verified,
    },
  };
}

// middleware helper to get user from request
export function getUserFromRequest(request: Request): TokenPayload | null {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }
  
  // If no Authorization header, try to get token from cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => {
        const [key, ...v] = c.split('=');
        return [key, v.join('=')];
      })
    );
    
    if (cookies.token) {
      return verifyToken(cookies.token);
    }
  }
  
  return null;
}

// role-based authorization
export function authorizeRoles(...roles: string[]) {
  return (user: TokenPayload | null): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };
}

// if user has role
export function hasRole(user: TokenPayload | null, role: string): boolean {
  return user?.role === role;
}

// if user has any of the roles
export function hasAnyRole(user: TokenPayload | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
