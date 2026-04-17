import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { usersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .use(bearer())
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
  .get("/current", async ({ bearer, set }) => {
    if (!bearer) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const user = await usersService.getCurrentUser(bearer);

    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    return { data: user };
  })
  .delete("/logout", async ({ bearer, set }) => {
    if (!bearer) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    await usersService.logoutUser(bearer);

    return { data: "OK" };
  });
