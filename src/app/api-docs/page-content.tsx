"use client";

import { useEffect, useRef } from "react";
// @ts-expect-error: no types for swagger-ui-dist
import { SwaggerUIBundle } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css";
import type { OpenAPIV3 } from "openapi-types";

export default function PageContent({ spec }: { spec: OpenAPIV3.Document }) {
  const swaggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swaggerRef.current || !spec) return;

    SwaggerUIBundle({
      domNode: swaggerRef.current,
      spec,
    });
  }, [spec]);

  return <div className="swagger-ui-wrapper" ref={swaggerRef} />;
}
