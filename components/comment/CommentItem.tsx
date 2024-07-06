"use client";

import { trpc } from "@/trpc/react";
import { Box, Checkbox, Paper, Typography } from "@mui/material";
import { Comment, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CommentItemProps {
  comment: Comment & { user: Pick<User, "id" | "name" | "image"> | null };
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
        <Paper sx={{ textAlign: "center", padding: "1rem 2rem" }}>
          {comment.content}
        </Paper>
      </Box>
    </Box>
  );
};
export default CommentItem;
