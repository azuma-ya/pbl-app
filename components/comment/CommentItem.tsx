"use client";

import { trpc } from "@/trpc/react";
import type { CommentWithUser } from "@/types/comment";
import { Box, Button, Checkbox, Paper, Typography } from "@mui/material";
import { ThreadStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import toast from "react-hot-toast";

interface CommentItemProps {
  comment: CommentWithUser;
  userId: string;
  parentId?: string;
  threadStatus: ThreadStatus;
  onChangeParentId: (id?: string) => void;
}

const CommentItem = ({
  comment,
  userId,
  parentId,
  threadStatus,
  onChangeParentId,
}: CommentItemProps) => {
  const router = useRouter();
  const [isSelected, setIsSlected] = useState(comment.isSelected);

  const { mutate: updateComment, isLoading } =
    trpc.comment.updateComment.useMutation({
      onSuccess: () => {
        toast.success("コメントを更新しました");
        router.refresh();
      },
      onError: (error) => {
        toast.error("コメントを更新に失敗しました");
        console.error(error);
        setIsSlected((prev) => !prev);
      },
    });

  const handleUpdateIsSelected = () => {
    setIsSlected((prev) => !prev);
    updateComment({ commentId: comment.id, isSelected: !comment.isSelected });
  };

  const handleChangeParentId = () => {
    if (threadStatus !== "ACTIVE") return;
    onChangeParentId(comment.id === parentId ? undefined : comment.id);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: comment.userId === userId ? "space-between" : "left",
      }}
    >
      <Checkbox
        size="small"
        checked={isSelected}
        onClick={handleUpdateIsSelected}
        disabled={
          threadStatus === "CLOSED" || threadStatus === "INACTIVE" || isLoading
        }
      />
      <Box sx={{}}>
        {comment.user && (
          <Typography variant="body2" component="p">
            {comment.user.name}
          </Typography>
        )}
        <Button
          variant="outlined"
          color={comment.id === parentId ? "info" : "primary"}
          onClick={handleChangeParentId}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          {comment.parent && (
            <Paper
              variant="outlined"
              sx={{
                padding: "0.25rem 0.5rem",
                marginY: 1,
                backgroundColor: "inherit",
              }}
            >
              <Typography variant="body2" textAlign="start">
                {comment.parent.content}
              </Typography>
            </Paper>
          )}
          <Typography
            variant="body1"
            sx={{
              textAlign: "start",
              padding: { xs: "0.25rem 0.5rem", sm: "0.5rem 1rem" },
              whiteSpace: "pre-wrap",
            }}
          >
            {comment.content}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};
export default CommentItem;
