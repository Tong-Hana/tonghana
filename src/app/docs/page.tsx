"use client";

import "swagger-ui-dist/swagger-ui.css";

export default function DocsPage() {
  return (
    <iframe
      src="/docs/swagger-ui/index.html"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
      title="Swagger Docs"
    />
  );
}
