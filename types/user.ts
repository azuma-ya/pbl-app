import type { User as PrismaUser, Role } from "@prisma/client";

export type User = PrismaUser;

export type UserWithRoles = PrismaUser & {
  roles: {
    role: Pick<Role, "id" | "name">;
  }[];
};
