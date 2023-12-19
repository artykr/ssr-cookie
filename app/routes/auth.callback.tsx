import { redirect } from "@remix-run/node";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient } from "~/lib/auth-client.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabaseClient = createServerClient({ request, headers });
    await supabaseClient.auth.exchangeCodeForSession(code);
  }

  return redirect("/", {
    headers,
  });
};
