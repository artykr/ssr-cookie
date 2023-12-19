import { Outlet } from "@remix-run/react";
import { useSupabase } from "~/root";

export default function AuthPage() {
  const context = useSupabase();

  return (
    <>
      <main>
        <div>
          <p>Auth: </p>
          <Outlet context={context} />
        </div>
      </main>
    </>
  );
}
