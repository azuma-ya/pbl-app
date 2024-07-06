"use client";

import CommentItem from "@/components/comment/CommentItem";
import CommentNew from "@/components/comment/CommentNew";
import ManualAdd from "@/components/manual/ManualAdd";
import ThreadProfileButton from "@/components/thread/ThreadProfile";
import type { ThreadWithCommentsManualsSubsribers } from "@/types/thread";
import type { UserWithRoles } from "@/types/user";
import type {
  ButtonProps} from "@mui/material";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { Manual } from "@prisma/client";
import Link from "next/link";

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
          users={users}
          subscribers={thread.subscribers}
          variant="outlined"
        />
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
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            padding: 2,
            display: "flex",
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
          <ManualAdd
            threadId={thread.id}
            manuals={manuals}
            linkedManuals={thread.linkedManuals}
            sx={{ marginBottom: "1rem" }}
          />
        </Paper>
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingX: "2rem",
          }}
        >
          <Stack spacing={2} sx={{ marginY: 2 }}>
            {thread.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} userId={userId} />
            ))}
          </Stack>
          {thread.status === "ACTIVE" && <CommentNew threadId={thread.id} />}
        </Paper>
      </Box>
    </Box>
  );
};

export default ThreadDetail;
