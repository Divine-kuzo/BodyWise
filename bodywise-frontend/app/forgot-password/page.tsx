import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Reset Password | BodyWise Africa",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email address and we’ll send you a secure link to set a new password."
      description="For security, the reset link will expire in 30 minutes. Reach out to support if you need extra help."
      footer={
        <div className="space-y-2">
          <p>
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-[#3a2218]">
              Return to login
            </Link>
          </p>
          <p>
            New to BodyWise?{" "}
            <Link href="/join" className="font-semibold text-[#3a2218]">
              Join the community
            </Link>
          </p>
        </div>
      }
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" requiredIndicator>
            Email address
          </Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" />
        </div>
        <Button type="submit" variant="secondary" className="w-full">
          Send reset link
        </Button>
        <p className="text-xs text-[#80685b]">
          Make sure to check your spam folder if you don&apos;t see the email in a few minutes.
        </p>
      </form>
    </AuthShell>
  );
}


