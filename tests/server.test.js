const request = require("supertest");
const app = require("../app.js");

describe("GET /api/v1/users/", () => {
  it("should respond with status 200", async () => {
    const response = await request(app).get("/api/v1/users/");
    expect(response.status).toBe(200);
  });
});
