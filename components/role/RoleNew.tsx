"use client";

import RhfTextField from "@/components/ui/RhfTextField";
import { trpc } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ButtonProps } from "@mui/material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

//入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: "2文字以上入力する必要があります" }),
});

//入力データの型を定義
type InputType = z.infer<typeof schema>;

export interface RoleNewDialogProps {
  open: boolean;
  onClose: () => void;
}

const RoleNewDialog = ({ open, onClose }: RoleNewDialogProps) => {
  const router = useRouter();

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createRole, isLoading } = trpc.school.createRole.useMutation({
    onSuccess: async () => {
      toast.success("役職を追加しました");
      router.refresh();
    },
    onError: (error) => {
      toast.error("役職の作成に失敗しました");
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    createRole({
      name: data.name,
    });
  };
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { minWidth: "20%" } }}
      maxWidth="lg"
    >
      <DialogTitle>役職の追加</DialogTitle>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ marginY: 2 }}>
            <RhfTextField
              control={form.control}
              name="name"
              label="役職名"
              fullWidth
            />
            <Button variant="contained" type="submit" disabled={isLoading}>
              追加する
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface RoleNewButton extends ButtonProps {}

const RoleNewButton = ({ children, ...props }: RoleNewButton) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button {...props} onClick={handleClickOpen}>
        {children}
      </Button>
      <RoleNewDialog open={open} onClose={handleClose} />
    </>
  );
};

export default RoleNewButton;
