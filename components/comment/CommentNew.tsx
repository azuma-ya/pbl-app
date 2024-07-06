"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import RhfTextField from "@/components/ui/RhfTextField";
import { trpc } from "@/trpc/react";
import { Box, Button } from "@mui/material";

//入力データの検証ルールを定義
const schema = z.object({
  content: z.string().min(3, { message: "3文字以上入力する必要があります" }),
});

//入力データの型を定義
type InputType = z.infer<typeof schema>;

interface CommentNewProps {
  threadId: string;
  parentId?: string;
}

const CommentNew = ({ threadId, parentId }: CommentNewProps) => {
  const router = useRouter();

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate: createComment, isLoading } =
    trpc.comment.createComment.useMutation({
      onSuccess: () => {
        // toast.success("投稿しました");
        form.reset();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
    });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    createComment({
      threadId,
      content: data.content,
      parentId,
    });
  };
  return (
    <Box
      component="form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      sx={{ display: "flex", gap: 4 }}
    >
      <RhfTextField
        control={form.control}
        name="content"
        label="内容"
        multiline
        sx={{ flex: 1 }}
      />
      <Box>
        <Button
          variant="contained"
          type="submit"
          sx={{ padding: "1rem 4rem" }}
          disabled={isLoading}
        >
          送信
        </Button>
      </Box>
    </Box>
  );
};

export default CommentNew;
