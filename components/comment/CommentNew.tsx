"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import RhfTextField from "@/components/ui/RhfTextField";
import type { CommentWithUser } from "@/types/comment";

//入力データの検証ルールを定義
const schema = z.object({
  content: z.string().min(3, { message: "3文字以上入力する必要があります" }),
});

//入力データの型を定義
type InputType = z.infer<typeof schema>;

interface CommentNewProps {
  parentComment?: CommentWithUser;
  onChangeParentId: (id?: string) => void;
  onCreateComment: (content: string) => void;
}

const CommentNew = ({
  parentComment,
  onChangeParentId,
  onCreateComment,
}: CommentNewProps) => {
  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    onCreateComment(data.content);
    form.reset();
  };
  return (
    <Stack>
      {parentComment && (
        <Box>
          <Paper
            variant="outlined"
            sx={{
              padding: "0.25rem 0.5rem",
              marginY: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">{parentComment.content}</Typography>
            <IconButton onClick={() => onChangeParentId(undefined)}>
              <ClearIcon />
            </IconButton>
          </Paper>
        </Box>
      )}
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        sx={{ display: "flex", gap: { xs: 1, sm: 4 } }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <RhfTextField
          control={form.control}
          name="content"
          label="内容"
          multiline
          maxRows={10}
          sx={{ flex: 1 }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
        <Box>
          <Button
            variant="contained"
            type="submit"
            sx={{ padding: { xs: "1rem 2rem", sm: "1rem 4rem" } }}
          >
            送信
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default CommentNew;
