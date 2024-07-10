"use client";

import ManualAddDialogButton from "@/components/manual/ManualAdd";
import { EnhancedUserTable } from "@/components/user/UserAdd";
import { trpc } from "@/trpc/react";
import type { ThreadWithCommentsManualsSubsribers } from "@/types/thread";
import type { UserWithRoles } from "@/types/user";
import LinkIcon from "@mui/icons-material/Link";
import type { ButtonProps } from "@mui/material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { Manual, ThreadStatus, ThreadUser } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ThreadProfileDialogProps {
  userId: string;
  thread: ThreadWithCommentsManualsSubsribers;
  users: UserWithRoles[];
  manuals: Manual[];
  open: boolean;
  selectedUsers: string[];
  isUpdate: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onChangeSelected: (value: string[]) => void;
}

const ThreadProfileDialog = ({
  userId,
  selectedUsers,
  isUpdate,
  open,
  thread,
  manuals,
  users,
  onClose,
  onUpdate,
  onChangeSelected,
}: ThreadProfileDialogProps) => {
  const router = useRouter();
  const sm = useMediaQuery("(min-width:600px)");

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

  const handleUpdate = () => {
    onUpdate();
  };

  const handleChangeSelected = (value: string[]) => {
    onChangeSelected(value);
  };

  let statusButton: ReactNode;

  switch (thread.status) {
    case "ACTIVE":
      statusButton = (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
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
            justifyContent: "end",
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
        {sm &&
          (thread.userId === userId || thread.status === "CLOSED") &&
          statusButton}
      </DialogTitle>
      {!sm && thread.status === "CLOSED" && (
        <Box sx={{ margin: "0rem 1rem 1rem 1rem" }}>{statusButton}</Box>
      )}
      <Typography
        variant="subtitle2"
        component="p"
        sx={{ margin: "0rem 1rem 1rem 1rem" }}
      >
        {thread.description}
      </Typography>
      {!sm && (
        <Box sx={{ marginX: 1 }}>
          <ManualAddDialogButton
            threadId={thread.id}
            manuals={manuals}
            linkedManuals={thread.linkedManuals}
            variant="text"
          >
            <LinkIcon sx={{ marginRight: 1 }} />
            紐づけられたマニュアルを見る
          </ManualAddDialogButton>
        </Box>
      )}
      <EnhancedUserTable
        users={users}
        selectedUsers={selectedUsers}
        isUpdate={isUpdate}
        onUpdate={handleUpdate}
        onChangeSelected={handleChangeSelected}
      />
    </Dialog>
  );
};

interface ThreadProfileButton extends ButtonProps {
  userId: string;
  thread: ThreadWithCommentsManualsSubsribers;
  users: UserWithRoles[];
  manuals: Manual[];
  subscribers: ThreadUser[];
}

const ThreadProfileButton = ({
  userId,
  thread,
  users,
  manuals,
  subscribers,
  ...props
}: ThreadProfileButton) => {
  const initialSelectedUsers = subscribers.map(
    (subscriber) => subscriber.userId,
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);
  const [isUpdate, setIsUpdate] = useState(false);

  const { mutate: updateSubscribers } =
    trpc.thread.updateThreadSubsucribers.useMutation({
      onSuccess: () => {
        toast.success("参加者の更新に成功しました");
        router.refresh();
        setIsUpdate(false);
      },
      onError: (error) => {
        toast.error("参加者の更新に失敗しました");
        console.error(error);
      },
    });

  const handleUpdate = () => {
    updateSubscribers({ threadId: thread.id, subscriberIds: selectedUsers });
  };

  const handleChangeSelected = (value: string[]) => {
    setSelectedUsers(value);
    if (
      value.length === initialSelectedUsers.length &&
      value.every((item) => initialSelectedUsers.includes(item))
    ) {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button {...props} onClick={handleClickOpen}>
        {thread.title}
      </Button>
      <ThreadProfileDialog
        isUpdate={isUpdate}
        open={open}
        selectedUsers={selectedUsers}
        thread={thread}
        users={users}
        manuals={manuals}
        userId={userId}
        onClose={handleClose}
        onUpdate={handleUpdate}
        onChangeSelected={handleChangeSelected}
      />
    </>
  );
};

export default ThreadProfileButton;
