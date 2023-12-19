import type { LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient } from "~/lib/auth-client.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const client = createServerClient({ request, headers });
    const { error } = await client.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirect(next || "/loggedin", {
        headers,
      });
    }

    const errorMessage = encodeURIComponent(error.message);
    return redirect(`/auth-error?error=${errorMessage}`, { headers });
  }

  return redirect("/", {
    headers,
  });
};
