import type { User as PrismaUser, Role } from "@prisma/client";

export type User = PrismaUser;

export type UserIdNameImage = Pick<PrismaUser, "id" | "name" | "image">;

export type UserWithRoles = PrismaUser & {
  roles: {
    role: Pick<Role, "id" | "name">;
  }[];
};
