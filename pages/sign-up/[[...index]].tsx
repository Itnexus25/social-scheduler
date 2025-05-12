// pages/sign-up/[[...index]].tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp routing="path" signInUrl="/sign-in" />;
}