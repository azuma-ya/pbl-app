"use client";

import { trpc } from "@/trpc/react";
import { CommentWithUser } from "@/types/comment";
import { Box, Checkbox, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CommentItemProps {
  comment: CommentWithUser;
  userId: string;
}

const CommentItem = ({ comment, userId }: CommentItemProps) => {
  const router = useRouter();
  const [isSelected, setIsSlected] = useState(comment.isSelected);

  const { mutate: updateComment, isLoading } =
    trpc.comment.updateComment.useMutation({
      onSuccess: (comment) => {
        toast.success("コメントを更新しました");
        router.refresh();
      },
      onError: (error) => {
        toast.error("マニュアルの作成に失敗しました");
        console.error(error);
        setIsSlected((prev) => !prev);
      },
    });

  const handleUpdateIsSelected = () => {
    setIsSlected((prev) => !prev);
    updateComment({ commentId: comment.id, isSelected: !comment.isSelected });
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
      />
      <Box sx={{}}>
        {comment.user && (
          <Typography variant="body1" component="p">
            {comment.user.name}
          </Typography>
        )}
        <Paper
          sx={{
            textAlign: "start",
            padding: "1rem 2rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {comment.content}
        </Paper>
      </Box>
    </Box>
  );
};
export default CommentItem;
