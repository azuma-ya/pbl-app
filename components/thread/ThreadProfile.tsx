"use client";

import { EnhancedUserTable } from "@/components/user/UserAdd";
import { trpc } from "@/trpc/react";
import { ThreadWithCommentsManuals } from "@/types/thread";
import { UserWithRoles } from "@/types/user";
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ThreadStatus } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

interface ThreadProfileDialogProps {
  userId: string;
  thread: ThreadWithCommentsManuals;
  users: UserWithRoles[];
  open: boolean;
  onClose: () => void;
}

const ThreadProfileDialog = ({
  userId,
  onClose,
  open,
  thread,
  users,
}: ThreadProfileDialogProps) => {
  const router = useRouter();
  const { mutate: updateStatus, isLoading: isStatusLoading } =
    trpc.thread.updateThreadStatus.useMutation({
      onSuccess: () => {
        toast.success("ステータスを変更しました");
        router.refresh();
      },
      onError: (error) => {
        toast.error("ステータスの変更に失敗しました");
        console.error(error);
      },
    });

  const { mutate: createManual, isLoading: isCreateManualLoading } =
    trpc.manual.createManual.useMutation({
      onSuccess: (manual) => {
        toast.success("マニュアルを作成しました");
        router.push(`/manual/${manual.id}`);
      },
      onError: (error) => {
        toast.error("マニュアルの作成に失敗しました");
        console.error(error);
      },
    });

  const handleUpdateStatus = (status: ThreadStatus) => {
    updateStatus({
      threadId: thread.id,
      status,
    });
  };

  const handleCreateManual = () => {
    createManual({ threadId: thread.id });
  };

  const handleClose = () => {
    onClose();
  };

  let statusButton: ReactNode;

  switch (thread.status) {
    case "ACTIVE":
      statusButton = (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button variant="outlined">削除</Button>
          <Button
            variant="contained"
            onClick={() => handleUpdateStatus("PREPARING_MANUAL")}
            disabled={isStatusLoading}
          >
            解決
          </Button>
        </Box>
      );
      break;
    case "CLOSED":
      statusButton = (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button variant="contained" disabled>
            解決済み
          </Button>
          <Button
            variant="contained"
            LinkComponent={Link}
            href={`/manual/${thread.manuals[0].id}`}
          >
            マニュアルを見る
          </Button>
        </Box>
      );
      break;
    case "INACTIVE":
      statusButton = <Button variant="contained">再開</Button>;
      break;
    case "PREPARING_MANUAL":
      statusButton = (
        <Button
          variant="contained"
          onClick={handleCreateManual}
          disabled={isCreateManualLoading}
        >
          マニュアル作成
        </Button>
      );
      break;
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { minHeight: "50%" } }}
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {thread.title}
        {thread.userId === userId && statusButton}
      </DialogTitle>
      <Typography
        variant="subtitle2"
        component="p"
        sx={{ margin: "0rem 1rem 1rem 1rem" }}
      >
        {thread.description}
      </Typography>
      <EnhancedUserTable users={users} />
    </Dialog>
  );
};

interface ThreadProfile extends BoxProps {
  userId: string;
  thread: ThreadWithCommentsManuals;
  users: UserWithRoles[];
}

const ThreadProfile = ({ userId, thread, users, ...props }: ThreadProfile) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box {...props}>
      <Button variant="outlined" onClick={handleClickOpen}>
        {thread.title}
      </Button>
      <ThreadProfileDialog
        userId={userId}
        open={open}
        onClose={handleClose}
        thread={thread}
        users={users}
      />
    </Box>
  );
};

export default ThreadProfile;
