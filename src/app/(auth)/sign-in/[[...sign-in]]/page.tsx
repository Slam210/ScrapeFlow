import { SignIn } from "@clerk/nextjs";

/**
 * Page component that renders Clerk's sign-in UI.
 *
 * This Next.js App Router page returns the <SignIn /> component from `@clerk/nextjs`,
 * displaying Clerk's hosted sign-in interface for this route.
 *
 * @returns The JSX element containing Clerk's sign-in UI.
 */
export default function Page() {
  return <SignIn />;
}
