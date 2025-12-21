import { OpenAPIV3 } from "openapi-types";

const spec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Hamro Concert API",
    version: "1.0.0",
    description: "API for concerts, ticket tiers, and ticket bookings",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/concerts": {
      post: {
        summary: "Create concert",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "artist", "date", "time", "venue", "city", "image"],
                properties: {
                  title: { type: "string" },
                  artist: { type: "string" },
                  date: { type: "string" },
                  time: { type: "string" },
                  venue: { type: "string" },
                  city: { type: "string" },
                  image: { type: "string" },
                  description: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
      get: {
        summary: "List concerts",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "OK" } },
      },

       put: {
        summary: "Update concert",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Concert" } } } },
        responses: { "200": { description: "OK" } },
      },
    },
    "/concerts/{id}": {
      get: {
        summary: "Get concert by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not Found" } },
      },
     
      delete: {
        summary: "Delete concert",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "No Content" } },
      },
    },

    "/ticket-tiers": {
      post: {
        summary: "Create ticket tier",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["concertId", "ticketTypeId", "price", "total", "available"],
                properties: {
                  concertId: { type: "string" },
                  ticketTypeId: { type: "integer" },
                  price: { type: "string" },
                  total: { type: "integer" },
                  available: { type: "integer" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
      get: {
        summary: "List ticket tiers",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "OK" } },
      },
      put: {
        summary: "Update ticket tier",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TicketTier" } } } },
        responses: { "200": { description: "OK" } },
      },
    },
    "/ticket-tiers/{id}": {
      get: {
        summary: "Get ticket tier by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not Found" } },
      },
      delete: {
        summary: "Delete ticket tier",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "204": { description: "No Content" } },
      },
    },
    "/ticket-tiers/all": {
      get: {
        summary: "List all ticket tiers (no pagination)",
        responses: { "200": { description: "OK" } },
      },
    },

    "/ticket-bookings": {
      post: {
        summary: "Create booking (supports multiple tiers per user)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userName", "userEmail", "ticketData"],
                properties: {
                  userName: { type: "string" },
                  userEmail: { type: "string", format: "email" },
                  ticketData: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      required: ["ticketTierId", "quantity"],
                      properties: {
                        ticketTierId: { type: "integer" },
                        quantity: { type: "integer", minimum: 1 },
                      },
                    },
                  },
                },
              },
              examples: {
                single: {
                  summary: "Single-tier",
                  value: {
                    userName: "Alice",
                    userEmail: "alice@example.com",
                    ticketData: [{ ticketTierId: 1, quantity: 2 }],
                  },
                },
                multi: {
                  summary: "Multi-tier",
                  value: {
                    userName: "Bob",
                    userEmail: "bob@example.com",
                    ticketData: [
                      { ticketTierId: 2, quantity: 1 },
                      { ticketTierId: 3, quantity: 4 },
                    ],
                  },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
  },
  components: {
    schemas: {
      Concert: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          artist: { type: "string" },
          date: { type: "string" },
          time: { type: "string" },
          venue: { type: "string" },
          city: { type: "string" },
          image: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      TicketTier: {
        type: "object",
        properties: {
          id: { type: "integer" },
          concertId: { type: "string" },
          ticketTypeId: { type: "integer" },
          price: { type: "string" },
          total: { type: "integer" },
          available: { type: "integer" },
        },
      },
    },
  },
};

export default spec;
