import React, { Suspense } from "react";
const TrainsClient = React.lazy(() => import("./TrainsClient"));

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <TrainsClient />
    </Suspense>
  );
}
