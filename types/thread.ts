import type { CommentWithUser } from "@/types/comment";
import type { ManualType } from "@/types/manual";
import type { UserIdNameImage } from "@/types/user";
import type { Thread as PrismaThread, ThreadUser } from "@prisma/client";

export type Thread = PrismaThread;

export type ThreadWithUsesrManuals = PrismaThread & {
  manuals: ManualType[];
} & { user: UserIdNameImage | null };

export type ThreadWithCommentsManualsSubsribers = PrismaThread & {
  comments: CommentWithUser[];
} & { manuals: ManualType[] } & { linkedManuals: { manual: ManualType }[] } & {
  subscribers: ThreadUser[];
};
