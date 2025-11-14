'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    try {
      await login(email, password);
      // Navigation is handled by the login function
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || localError) && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error || localError}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" requiredIndicator>
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" requiredIndicator>
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#6a4a3a] transition hover:text-[#3a2218]"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[#6a4a3a]">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border border-[#d7c6ba] text-[#6a4a3a] focus:ring-[#d6b28f]"
            disabled={isLoading}
          />
          Remember me
        </label>
      </div>

      <Button
        type="submit"
        variant="secondary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      {/* Quick test credentials hint for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-800">
          <p className="font-semibold mb-2">Test Credentials:</p>
          <p>System Admin: a.niyonseng@alustudent.com / admin123</p>
          <p>Patient: testpatient@example.com / patient123</p>
        </div>
      )}
    </form>
  );
}
