// source: https://www.npmjs.com/package/swagger-autogen?activeTab=readme

import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',      // by default: '1.0.0'
    title: 'Tasks API',        // by default: 'REST API'
    description: 'API which manages Tasks, and requires a Login to access them.',  // by default: ''
  },
  host: 'localhost:3000',      // by default: 'localhost:3000'
  basePath: '/',  // by default: '/'
  schemes: ['http'],   // by default: ['http']
  consumes: ['application/json'],  // by default: ['application/json']
  produces: ['application/json'],  // by default: ['application/json']
  tags: [        // by default: empty Array
    {
      name: '',         // Tag name
      description: '',  // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {},  // by default: empty object
  definitions: {},          // by default: empty object (Swagger 2.0)
  components: {}            // by default: empty object (OpenAPI 3.x)
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.ts'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);