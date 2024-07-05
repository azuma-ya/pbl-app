import { EnhancedUserTable } from "@/components/user/UserAdd";
import { UserWithRoles } from "@/types/user";
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Thread } from "@prisma/client";
import { ReactNode, useState } from "react";

interface ThreadProfileDialogProps {
  thread: Thread;
  users: UserWithRoles[];
  open: boolean;
  onClose: () => void;
}

const ThreadProfileDialog = ({
  onClose,
  open,
  thread,
  users,
}: ThreadProfileDialogProps) => {
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
          <Button variant="contained">解決</Button>
        </Box>
      );
      break;
    case "CLOSED":
      statusButton = (
        <Button variant="contained" disabled>
          解決済み
        </Button>
      );
      break;
    case "INACTIVE":
      statusButton = <Button variant="contained">再開</Button>;
      break;
    case "PREPARING_MANUAL":
      statusButton = <Button variant="contained">マニュアル作成</Button>;
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
        {statusButton}
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
  thread: Thread;
  users: UserWithRoles[];
}

const ThreadProfile = ({ thread, users, ...props }: ThreadProfile) => {
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
        open={open}
        onClose={handleClose}
        thread={thread}
        users={users}
      />
    </Box>
  );
};

export default ThreadProfile;
