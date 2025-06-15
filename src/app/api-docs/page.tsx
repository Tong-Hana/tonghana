import { notFound } from "next/navigation";
import { getSwaggerSpec } from "../../lib/swagger";
import PageContent from "./page-content";

export default async function SwaggerPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const spec = getSwaggerSpec();

  return <PageContent spec={spec} />;
}
