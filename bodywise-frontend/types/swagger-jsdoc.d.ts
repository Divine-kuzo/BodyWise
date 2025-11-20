declare module 'swagger-jsdoc' {
  interface Options {
    definition: {
      openapi: string;
      info: {
        title: string;
        version: string;
        description?: string;
        contact?: {
          name?: string;
          email?: string;
        };
        license?: {
          name: string;
          url: string;
        };
      };
      servers?: Array<{
        url: string;
        description?: string;
      }>;
      tags?: Array<{
        name: string;
        description?: string;
      }>;
      components?: any;
    };
    apis: string[];
  }

  function swaggerJsdoc(options: Options): any;
  namespace swaggerJsdoc {
    export { Options };
  }
  
  export = swaggerJsdoc;
}
