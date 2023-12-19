import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "~/lib/auth-client.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") || "/";

  if (token_hash && type) {
    const headers = new Headers();
    const supabase = createServerClient({ request, headers });

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return redirect(next || "/", { headers });
    }

    const errorMessage = encodeURIComponent(error.message);
    return redirect(`/auth-error?error=${errorMessage}`);
  }

  // return the user to an error page with instructions
  return redirect("/auth-error");
}
