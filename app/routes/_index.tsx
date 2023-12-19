import type {
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getServerSession } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, headers } = await getServerSession(request);

  if (session) {
    return redirect("/loggedin", { headers });
  }

  return json({})
};

export default function Index() {
  return (
    <div>
      <Link to="/login">Log in</Link>
    </div>
  );
}
