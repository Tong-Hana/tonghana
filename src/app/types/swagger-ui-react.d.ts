declare module "swagger-ui-react" {
  import * as React from "react";

  interface SwaggerUIProps {
    url: string;
  }

  const SwaggerUI: React.ComponentType<SwaggerUIProps>;

  export default SwaggerUI;
}
