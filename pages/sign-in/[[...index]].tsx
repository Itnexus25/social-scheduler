// pages/sign-in/[[...index]].tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn path="/sign-in" routing="path" afterSignInUrl="/dashboard" />;
}