import type { CommentWithUser } from "@/types/comment";
import type { Manual } from "@/types/manual";
import type { Thread as PrismaThread, ThreadUser } from "@prisma/client";

export type Thread = PrismaThread;

export type ThreadWithCommentsManualsSubsribers = PrismaThread & {
  comments: CommentWithUser[];
} & { manuals: Manual[] } & { linkedManuals: { manual: Manual }[] } & {
  subscribers: ThreadUser[];
};
