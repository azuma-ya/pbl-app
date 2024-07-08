"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import RhfTextField from "@/components/ui/RhfTextField";
import UserAddButton from "@/components/user/UserAdd";
import { trpc } from "@/trpc/react";
import type { UserWithRoles } from "@/types/user";

//入力データの検証ルールを定義
const schema = z.object({
  title: z.string().min(3, { message: "3文字以上入力する必要があります" }),
  description: z
    .string()
    .min(3, { message: "3文字以上入力する必要があります" }),
});

//入力データの型を定義
type InputType = z.infer<typeof schema>;

interface ThreadNewProps {
  users: UserWithRoles[];
  userId: string;
}

const ThreadNew = ({ users, userId }: ThreadNewProps) => {
  const router = useRouter();
  const [subscriberIds, setSubscriberIds] = useState<string[]>([]);

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { mutate: createThread, isLoading } =
    trpc.thread.createThread.useMutation({
      onSuccess: (thread) => {
        toast.success("作成しました");
        form.reset();
        router.push(`/thread/${thread.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
    });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    createThread({
      title: data.title,
      description: data.description,
      subscriberIds,
    });
  };

  const handleChangeSubscriberIds = (subscriberIds: string[]) => {
    setSubscriberIds(subscriberIds);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
      }}
      component="form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
        スレッド作成
      </Typography>
      <RhfTextField
        fullWidth
        id="outlined-basic"
        label="タイトル"
        variant="outlined"
        name="title"
        control={form.control}
      />
      <RhfTextField
        fullWidth
        multiline
        rows={10}
        id="outlined-basic"
        label="詳細"
        variant="outlined"
        name="description"
        control={form.control}
      />
      <UserAddButton
        users={users.filter((user) => user.id !== userId)}
        subscriberIds={subscriberIds}
        onChangeSubscriberIds={handleChangeSubscriberIds}
        variant="contained"
        sx={{ marginY: 2 }}
      >
        教師選択
      </UserAddButton>
      <Button fullWidth variant="contained" type="submit" disabled={isLoading}>
        作成
      </Button>
    </Box>
  );
};

export default ThreadNew;
