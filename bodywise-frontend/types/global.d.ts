// Global type declarations for packages without built-in types

declare module 'swagger-ui-react' {
  import { ComponentType } from 'react';
  
  interface SwaggerUIProps {
    url?: string;
    spec?: any;
    [key: string]: any;
  }
  
  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}
