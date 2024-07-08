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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

//入力データの検証ルールを定義
const schema = z
  .object({
    name: z.string().min(2, { message: "2文字以上入力する必要があります" }),
    password: z.string().min(6, { message: "6文字以上入力する必要があります" }),
    repeatedPassword: z
      .string()
      .min(6, { message: "6文字以上入力する必要があります" }),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: "パスワードと確認用パスワードが一致しません",
    path: ["repeatedPassword"],
  });

//入力データの型を定義
type InputType = z.infer<typeof schema>;

interface SchoolAddDialogProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const SchoolAddDialog = ({ open, onClose }: SchoolAddDialogProps) => {
  const router = useRouter();
  const { update } = useSession();

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      repeatedPassword: "",
    },
  });

  const { mutate: updateUserSchool, isLoading } =
    trpc.school.createSchool.useMutation({
      onSuccess: async (school) => {
        toast.success("学校に参加しました");
        await update({
          user: {
            schoolId: school.id,
          },
        })
          .then(() => router.refresh())
          .then(() => router.push("/"));
      },
      onError: (error) => {
        toast.error("学校の作成に失敗しました");
        console.error(error);
      },
    });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    updateUserSchool({
      name: data.name,
      password: data.password,
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { width: "50%" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        学校を追加する
      </DialogTitle>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ marginY: 2 }}>
            <RhfTextField
              control={form.control}
              name="name"
              label="学校名"
              fullWidth
            />
            <RhfTextField
              control={form.control}
              name="password"
              label="合言葉"
              fullWidth
              type="password"
            />
            <RhfTextField
              control={form.control}
              name="repeatedPassword"
              label="確認用"
              fullWidth
              type="password"
            />
            <Button variant="contained" type="submit" disabled={isLoading}>
              参加する
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface SchoolAddButton extends ButtonProps {
  userId: string;
}

const SchoolAddButton = ({ userId, children, ...props }: SchoolAddButton) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button onClick={handleClickOpen} {...props}>
        {children}
      </Button>
      <SchoolAddDialog userId={userId} open={open} onClose={handleClose} />
    </>
  );
};

export default SchoolAddButton;
