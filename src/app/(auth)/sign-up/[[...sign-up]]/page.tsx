import { SignUp } from "@clerk/nextjs";

/**
 * Renders Clerk's SignUp UI for the sign-up route.
 *
 * This default Next.js page component returns the Clerk <SignUp /> element. It accepts no props and has no side effects or local state.
 *
 * @returns The JSX element that renders Clerk's sign-up flow.
 */
export default function Page() {
  return <SignUp />;
}
