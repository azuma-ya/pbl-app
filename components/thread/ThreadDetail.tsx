"use client";

import type { ButtonProps } from "@mui/material";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { Manual } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

import CommentItem from "@/components/comment/CommentItem";
import CommentNew from "@/components/comment/CommentNew";
import ManualAddDialogButton from "@/components/manual/ManualAdd";
import ThreadProfileButton from "@/components/thread/ThreadProfile";
import { pusherClient } from "@/lib/pusher/client";
import type { CommentWithUser } from "@/types/comment";
import type { ThreadWithCommentsManualsSubsribers } from "@/types/thread";
import type { UserWithRoles } from "@/types/user";
import { useRouter } from "next/navigation";

interface ManualItemProps extends ButtonProps {
  manual: Manual;
}

const ManualItem = ({ manual, ...props }: ManualItemProps) => {
  return (
    <Button
      LinkComponent={Link}
      href={`/manual/${manual.id}`}
      variant="outlined"
      {...props}
    >
      {manual.title}
    </Button>
  );
};

interface ThreadDetailProps {
  thread: ThreadWithCommentsManualsSubsribers;
  manuals: Manual[];
  users: UserWithRoles[];
  userId: string;
}

const ThreadDetail = ({
  thread,
  manuals,
  users,
  userId,
}: ThreadDetailProps) => {
  const router = useRouter();
  const sm = useMediaQuery("(min-width:600px)");
  const [parentId, setParentId] = useState<string>();
  const [comments, setComments] = useState<CommentWithUser[]>(thread.comments);

  // const { mutate: createComment, isLoading } =
  //   trpc.comment.createComment.useMutation({
  //     onSuccess: () => {
  //       // toast.success("投稿しました");
  //       form.reset();
  //       onChangeParentId(undefined);
  //       router.refresh();
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //       console.error(error);
  //     },
  //   });

  const handleChangeParentId = (id?: string) => {
    setParentId(id);
  };

  const handleCreateComment = async (content: string) => {
    // createComment({
    //   threadId,
    //   content: data.content,
    //   parentId: parentComment?.id,
    // });
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId: thread.id,
        content,
        parentId,
      }),
    })
      .then((data) => data.json())
      .then((comment: CommentWithUser) => {
        setParentId(undefined);
        router.refresh();
      });
  };

  useEffect(() => {
    const channel = pusherClient
      .subscribe(thread.id)
      .bind("new-comment", (data: CommentWithUser) => {
        setComments((prevComments) => [...prevComments, data]);
      });
    // .bind("update-comment", (data: CommentWithUser) => {
    //   setComments((prevComments) =>
    //     prevComments.map((comment) =>
    //       comment.id === data.id ? data : comment,
    //     ),
    //   );
    // });
    return () => {
      channel.unbind();
    };
  }, [thread.id]);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ paddingY: "1rem" }}>
        <ThreadProfileButton
          userId={userId}
          thread={thread}
          users={users.filter((user) => user.id !== userId)}
          manuals={manuals}
          subscribers={thread.subscribers}
          variant="outlined"
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flex: 1,
          gap: 1,
          paddingBottom: 4,
        }}
      >
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            padding: 2,
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            width: "11rem",
          }}
        >
          <Typography my={1} variant="body1" component="h2">
            紐づけたマニュアル
          </Typography>
          <Stack spacing={1} sx={{ flex: 1 }}>
            {thread.linkedManuals.map((linkedManual) => (
              <ManualItem
                key={linkedManual.manual.id}
                manual={linkedManual.manual}
                sx={{ textAlign: "center", padding: "0.5rem 1rem" }}
              >
                {linkedManual.manual.title}
              </ManualItem>
            ))}
          </Stack>
          <ManualAddDialogButton
            threadId={thread.id}
            manuals={manuals}
            linkedManuals={thread.linkedManuals}
            sx={{ marginBottom: "1rem" }}
            variant="contained"
          >
            マニュアルを追加する
          </ManualAddDialogButton>
        </Paper>
        <Paper
          elevation={0}
          variant={sm ? "outlined" : "elevation"}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingX: { xs: 0, sm: "2rem" },
          }}
        >
          <Stack
            spacing={2}
            sx={{
              marginY: 2,
              overflowY: "auto",
              paddingX: { xs: 0, sm: "1rem" },
            }}
          >
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                userId={userId}
                parentId={parentId}
                threadStatus={thread.status}
                onChangeParentId={handleChangeParentId}
              />
            ))}
          </Stack>
          {thread.status === "ACTIVE" && (
            <CommentNew
              parentComment={comments.find(
                (comment) => comment.id === parentId,
              )}
              onChangeParentId={handleChangeParentId}
              onCreateComment={handleCreateComment}
            />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ThreadDetail;
