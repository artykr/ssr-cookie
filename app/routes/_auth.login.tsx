import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getServerSession } from "~/session.server";
import { useSupabase } from "~/root";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const redirectTo = new URL(request.url).searchParams.get("next");

  try {
    const { session, headers } = await getServerSession(request);

    if (session) {
      return redirect(redirectTo || "/loggedin", {
        headers,
      });
    }

    return json({});
  } catch (e) {
    return json({});
  }
};

export default function Signup() {
  const context = useSupabase();

  const handleGitHubLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const baseUrl = window.location.origin;
    await context.supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${baseUrl}/callback`,
      },
    });
  };

  return (
    <>
      <div>
        <button
            onClick={handleGitHubLogin}
        >
         Login with Github
        </button>
      </div>
    </>
  );
}
