import React, { Suspense } from "react";

import LoginAdminClient from "./LoginAdminClient";

export default function LoginAdminPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading…</div>}>
      <LoginAdminClient />
    </Suspense>
  );
}
