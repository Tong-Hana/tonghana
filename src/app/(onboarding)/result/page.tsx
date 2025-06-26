"use client";

import { Suspense } from "react";
import FTTIResultContent from "./FTTIResultContent";

export default function FTTIResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FTTIResultContent />
    </Suspense>
  );
}
