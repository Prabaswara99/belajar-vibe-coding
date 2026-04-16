import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .use(cors())
  .use(usersRoute)
  .get("/", () => "Hello from Elysia")
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
