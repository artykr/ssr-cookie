import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const errorDescription = url.searchParams.get("error");

  return json({ error: errorDescription });
};

export default function AuthError() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Authentication error</h1>
      <p>{data.error}.</p>
    </div>
  );
}
