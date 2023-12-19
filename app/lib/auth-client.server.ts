import {
  createServerClient as _createServerClient,
  parse,
  serialize,
} from "@supabase/ssr";

import { getEnv } from "~/lib/envt";

export const createServerClient = ({
  request,
  headers,
}: {
  request: Request;
  headers: Headers;
  persistSession?: boolean;
}) => {
  const supabaseUrl = getEnv("SUPABASE_URL");
  const supabaseAnonKey = getEnv("SUPABASE_ANON_KEY");

  const cookies = parse(request.headers.get("Cookie") ?? "");

  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append("Set-Cookie", serialize(key, value, options));
      },
      remove(key, options) {
        headers.append("Set-Cookie", serialize(key, "", options));
      },
    },
  });
};
