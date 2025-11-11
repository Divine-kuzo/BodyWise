import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Login | BodyWise Africa",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your BodyWise journey with personalized insights and community support."
      description="Access your dashboard, continue assessments, and stay connected with verified wellness professionals."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#3a2218]">
            Create one
          </Link>
        </p>
      }
    >
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" requiredIndicator>
              Email address
            </Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" />
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
            <Input id="password" name="password" type="password" placeholder="Enter your password" />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-[#6a4a3a]">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border border-[#d7c6ba] text-[#6a4a3a] focus:ring-[#d6b28f]"
            />
            Remember me
          </label>
        </div>
        <Button type="submit" variant="secondary" className="w-full">
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}


