import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Create Account | BodyWise Africa",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your BodyWise account"
      subtitle="Unlock culturally aligned resources, AI-led guidance, and verified experts to support your wellness journey."
      description="Sign up as an individual or represent your institution—the right pathway starts with your details."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#3a2218]">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" requiredIndicator>
              First name
            </Label>
            <Input id="firstName" name="firstName" placeholder="Ama" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" requiredIndicator>
              Last name
            </Label>
            <Input id="lastName" name="lastName" placeholder="Mensah" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" requiredIndicator>
            Email address
          </Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" requiredIndicator>
            Password
          </Label>
          <Input id="password" name="password" type="password" placeholder="Create a strong password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" requiredIndicator>
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] shadow-[0_12px_40px_-28px_rgba(58,34,24,0.6)] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#f0d5b8]/80"
            defaultValue="user"
          >
            <option value="user">Individual</option>
            <option value="institution">Institution</option>
          </select>
        </div>
        <Button type="submit" variant="secondary" className="w-full">
          Create account
        </Button>
        <p className="text-xs text-[#80685b]">
          By continuing, you agree to BodyWise Africa&apos;s{" "}
          <Link href="#" className="font-semibold text-[#3a2218]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-semibold text-[#3a2218]">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}


