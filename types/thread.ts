import { CommentWithUser } from "@/types/comment";
import { Manual } from "@/types/manual";
import { Thread as PrismaThread } from "@prisma/client";

export type Thread = PrismaThread;

export type ThreadWithCommentsManuals = PrismaThread & {
  comments: CommentWithUser[];
} & { manuals: Manual[] } & { linkedManuals: { manual: Manual }[] };
