import { redirect } from "@remix-run/node";
import { createServerClient } from "~/lib/auth-client.server";

export const requireUser = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) => {
  const { session, headers } = await getServerSession(request);

  if (!session) {
    const searchParams = new URLSearchParams([["next", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return { user: session.user, headers, session };
};

export const getServerSession = async (request: Request) => {
  const headers = new Headers();
  const supabase = createServerClient({ request, headers });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session, headers };
};
