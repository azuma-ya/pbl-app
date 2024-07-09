import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { pusherInstance } from "@/lib/pusher/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
  const user = await getAuthSession();
  if (!user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const body = await req.json();

  try {
    const {
      threadId,
      content,
      parentId,
    }: { threadId: string; content: string; parentId: string } = body;

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        content,
        threadId,
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        parent: true,
      },
    });

    await pusherInstance.trigger(threadId, "new-comment", comment);

    return NextResponse.json(comment, {
      status: 200,
    });
  } catch (error) {}
};
