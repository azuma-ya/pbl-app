import { User } from "@/types/user";
import { Comment as PrismaComment } from "@prisma/client";

export type Comment = PrismaComment;

export type CommentWithUser = Comment & {
  user: Pick<User, "id" | "name" | "image"> | null;
};
