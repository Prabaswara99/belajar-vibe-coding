import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const usersService = {
  async registerUser(name: string, email: string, password: string) {
    // 1. Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "email sudah terdaftar" };
    }

    // 2. Hash password with bcrypt
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 3. Generate token
    const token = crypto.randomUUID();

    // 4. Insert user into database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      token,
    });

    return { success: true, token };
  },

  async getCurrentUser(token: string) {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.token, token))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  },
};
