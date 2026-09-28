import logger from "#config/looger.js";
import bcrypt from "bcrypt";
import { db } from "#config/database.js";
import { users } from "#models/User.model.js";
import { eq } from "drizzle-orm";

export const hashPassword = async (password)=> {
  try {
    return await bcrypt.hash(password, 12);
  } catch (error) {
    logger.error("error hashing the password", error);
    throw new Error("hashing error",error);
  }
};

export const createUser = async ({name, email, password, role="user"})=> {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) throw new Error("user already exists");

    const password_hash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({name, email, password:password_hash, role})
      .returning({id: users.id, name: users.name, email: users.email, role: users.role, created_at: users.created_at});

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;

  } catch (error) {
    logger.error("error creating the user", error);
    throw new Error("creating user error", { cause: error });
  }
};

export const comparePassword = async (plainPassword, hashedPassword)=> {
  try {
    if (!plainPassword || !hashedPassword) {
      throw new Error(`Missing arguments. Got plainPassword: ${typeof plainPassword}, hashedPassword: ${typeof hashedPassword}`);
    }

    return await bcrypt.compare(plainPassword, hashedPassword);

  } catch (error) {
    logger.error("error comparing the password", error);
    throw new Error("comparing password error",  { cause: error });
  }
};

export const authenticateUser = async (email, password)=> {
  try {
    const [candidate] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    const passwordMatches = await comparePassword(
      password,
      candidate.password
    );

    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    return candidate;
  } catch (error) {
    logger.error("error authenticating the password", error);
    throw error;
  }
};