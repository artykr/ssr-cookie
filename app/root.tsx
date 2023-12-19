import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  LiveReload,
  Outlet,
  Scripts,
  useLoaderData,
  useLocation,
  useNavigate,
  useRevalidator,
} from "@remix-run/react";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "~/lib/auth-client.server";
import { getBrowserEnv } from "~/lib/envt";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useOutletContext } from "react-router";
import { parseLocationHash } from "~/lib/utils.client";

export type TypedSupabaseClient = SupabaseClient;

export type ContextType = {
  supabase: TypedSupabaseClient;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const beamToken = process.env.BEAM_TOKEN;
  const headers = new Headers();
  const supabase = createServerClient({ request, headers });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json(
    {
      env: getBrowserEnv(),
      session,
    },
    { headers },
  );
};

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();
  const location = useLocation();
  const navigate = useNavigate();

  const [supabase] = useState<TypedSupabaseClient>(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
  );

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event !== "INITIAL_SESSION" &&
        session?.access_token !== serverAccessToken
      ) {
        // server and client are out of sync.
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, revalidate]);

  useEffect(() => {
    // Supabase provides error as a hash when the email link expires
    const params = parseLocationHash(location);

    if (params.error) {
      const navigateParams = new URLSearchParams();
      navigateParams.append("error", params.error_description);

      navigate(`/auth-error?${navigateParams.toString()}`);
    }
  }, [location, navigate]);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="h-full bg-gray-50">
        <Outlet context={{ supabase }} />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function useSupabase() {
  return useOutletContext<ContextType>();
}
