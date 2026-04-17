import { Elysia, t } from "elysia";
import { usersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .post(
    "/",
    async ({ body, set }) => {
      const { name, email, password } = body;

      const result = await usersService.registerUser(name, email, password);

      if (!result.success) {
        set.status = 400;
        return { error: result.error };
      }

      set.status = 201;
      return { 
        message: "User registered successfully",
        token: result.token
      };
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .get("/current", async ({ headers, set }) => {
    const authHeader = headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const token = authHeader.split(" ")[1];
    const user = await usersService.getCurrentUser(token);

    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    return { data: user };
  })
  .delete("/logout", async ({ headers, set }) => {
    const authHeader = headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const token = authHeader.split(" ")[1];
    const success = await usersService.logoutUser(token);

    if (!success) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    return { data: "OK" };
  });
