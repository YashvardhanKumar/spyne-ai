import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db";
import { userRoute } from "./routes/user";
import { carRoute } from "./routes/car";
import swaggerUi from "swagger-ui-express";
import path from "path";
import YAML from 'yamljs';

// configure dotenv to access environment variables

const app = express();
connectDB();

app.use(express.json());
// Serve static files (if any) such as images in the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Set up Swagger options
// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Car Management API',
//       version: '1.0.0',
//       description: 'API documentation for the Car Management Application',
//     },
//     servers: [
//       {
//         url: 'http://localhost:5050',
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [],
//       },
//     ],
//   },
//   apis: ['./src/routes/*.ts'], // Point to the routes where Swagger comments are written
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API for JSONPlaceholder',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'JSONPlaceholder',
        url: 'https://jsonplaceholder.typicode.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Development server',
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerDocument = YAML.load(path.join(__dirname, '../backend/swagger.yaml'));

// const swaggerDocs = swaggerJsDoc(swaggerDocument);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", userRoute); // User routes for signup and login
app.use("/api/cars", carRoute); // Car routes for CRUD operations

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
