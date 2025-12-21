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

    "/seats/concert/{concertId}": {
      get: {
        summary: "Get all seats for a concert",
        parameters: [
          { name: "concertId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: { 
          "200": { 
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SeatListResponse" }
              }
            }
          },
          "404": { description: "Concert not found" }
        },
      },
    },

    "/seats/concert/{concertId}/available": {
      get: {
        summary: "Get available seats for a concert",
        parameters: [
          { name: "concertId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: { 
          "200": { 
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Seat" }
                }
              }
            }
          },
          "404": { description: "Concert not found" }
        },
      },
    },

    "/ticket-bookings/seats": {
      post: {
        summary: "Book specific seats",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userName", "userEmail", "seatIds"],
                properties: {
                  userName: { type: "string" },
                  userEmail: { type: "string", format: "email" },
                  seatIds: {
                    type: "array",
                    minItems: 1,
                    items: { type: "integer" }
                  },
                },
              },
              example: {
                userName: "Alice",
                userEmail: "alice@example.com",
                seatIds: [1, 2, 3],
              },
            },
          },
        },
        responses: { 
          "201": { 
            description: "Seats booked successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SeatBookingResponse" }
              }
            }
          },
          "400": { description: "Bad request - seats unavailable or invalid" },
          "404": { description: "Concert or seats not found" }
        },
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
      Seat: {
        type: "object",
        properties: {
          id: { type: "integer" },
          concertId: { type: "string" },
          ticketTierId: { type: "integer" },
          seatNumber: { type: "string" },
          row: { type: "integer" },
          section: { type: "string", enum: ["front", "vip", "ga"] },
          isBooked: { type: "boolean" },
          userId: { type: "string", nullable: true },
          bookedAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SeatListResponse: {
        type: "object",
        properties: {
          seats: {
            type: "array",
            items: { $ref: "#/components/schemas/Seat" }
          },
          totalSeats: { type: "integer" },
          availableSeats: { type: "integer" },
          bookedSeats: { type: "integer" },
        },
      },
      SeatBookingResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userName: { type: "string" },
          userEmail: { type: "string" },
          ticketData: {
            type: "array",
            items: {
              type: "object",
              properties: {
                concertId: { type: "string" },
                ticketTierId: { type: "integer" },
                quantity: { type: "integer" },
                pricePerTicket: { type: "string" },
                totalAmount: { type: "string" },
                status: { type: "string" },
                createdAt: { type: "string", format: "date-time", nullable: true },
                seatNumbers: { type: "array", items: { type: "string" } },
              },
            },
          },
          seatIds: { type: "array", items: { type: "integer" } },
        },
      },
    },
  },
};

export default spec;
