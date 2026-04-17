import { Elysia, t } from "elysia";
import { usersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" }).post(
  "/users",
  async ({ body, set }) => {
    const { name, email, password } = body;

    const result = await usersService.registerUser(name, email, password);

    if (!result.success) {
      set.status = 400;
      return { error: result.error };
    }

    set.status = 201;
    return { message: "User registered successfully" };
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    }),
  }
);
