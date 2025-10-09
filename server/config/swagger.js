import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Projet MyContact",
      version: "1.0.0",
      description: "Documentation Swagger de l’API",
    },
    servers: [
      {
        url: "https://mycontact-backend-chlz.onrender.com",
        description: "Serveur backend",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Saisissez le token JWT obtenu après connexion (format : Bearer <votre_token>)",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
