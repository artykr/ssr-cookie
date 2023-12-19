import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createServerClient } from "~/lib/auth-client.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = new Headers();
  const supabase = createServerClient({ request, headers });
  await supabase.auth.signOut();

  return redirect("/", { headers });
};

export const loader = async () => redirect("/");
