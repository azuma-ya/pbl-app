"use client";

import CommentItem from "@/components/comment/CommentItem";
import CommentNew from "@/components/comment/CommentNew";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Comment, Thread, User } from "@prisma/client";
import { ReactNode } from "react";

const ManualItem = ({ children }: { children: ReactNode }) => {
  return (
    <Paper sx={{ textAlign: "center", padding: "0.5rem 1rem" }}>
      {children}
    </Paper>
  );
};

interface ThreadDetailProps {
  thread: Thread & {
    comments: (Comment & { user: Pick<User, "id" | "name" | "image"> })[];
  };
  userId: string;
}

const ThreadDetail = ({ thread, userId }: ThreadDetailProps) => {
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
        <Button variant="outlined">{thread.title}</Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          flex: 1,
          display: "flex",
          gap: 1,
          paddingBottom: 4,
        }}
      >
        <Box sx={{ backgroundColor: "#ddd", padding: 2 }}>
          <Typography my={1} variant="body1" component="h2">
            紐づけたマニュアル
          </Typography>
          <Stack spacing={1}>
            <ManualItem>ManualItem 1</ManualItem>
            <ManualItem>ManualItem 2</ManualItem>
            <ManualItem>ManualItem 3</ManualItem>
          </Stack>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "2rem 2rem 0.5rem 2rem",
            backgroundColor: "#ddd",
          }}
        >
          <Stack spacing={2}>
            {thread.comments.map((comment) => (
              <CommentItem comment={comment} userId={userId} />
            ))}
          </Stack>
          <CommentNew threadId={thread.id} />
        </Box>
      </Box>
    </Box>
  );
};

export default ThreadDetail;
