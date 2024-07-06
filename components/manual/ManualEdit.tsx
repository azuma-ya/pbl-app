"use client";

import RhfTextField from "@/components/ui/RhfTextField";
import { trpc } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Button, Paper, Stack } from "@mui/material";
import { Manual } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

//入力データの検証ルールを定義
const schema = z.object({
  title: z.string().min(3, { message: "3文字以上入力する必要があります" }),
  content: z.string().min(3, { message: "3文字以上入力する必要があります" }),
});

//入力データの型を定義
type InputType = z.infer<typeof schema>;

interface ManualEditProps {
  manual: Manual;
  userId: string;
}

const ManualEdit = ({ manual }: ManualEditProps) => {
  const router = useRouter();
  const [isUpdate, setIsUpdate] = useState(false);

  const { watch, ...form } = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: manual.title,
      content: manual.content,
    },
  });

  const { mutate: updateManual, isLoading } =
    trpc.manual.updateManual.useMutation({
      onSuccess: () => {
        toast.success("編集しました");
        form.reset();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
    });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    updateManual({
      manualId: manual.id,
      title: data.title,
      content: data.content,
    });
  };

  useEffect(() => {
    const subscription = watch(() => setIsUpdate(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Paper elevation={8} sx={{ padding: 4, margin: 4 }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button component={Link} href={`/manual/${manual.id}`} passHref>
              <ArrowBackIcon sx={{ marginRight: 1 }} fontSize="small" />
              マニュアルに戻る
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading || !isUpdate}
            >
              <DoneIcon sx={{ marginRight: 1 }} fontSize="small" />
              更新する
            </Button>
          </Box>
          <RhfTextField
            control={form.control}
            name="title"
            label="タイトル"
            fullWidth
          />
          <RhfTextField
            control={form.control}
            name="content"
            label="本文"
            multiline
            fullWidth
          />
        </Stack>
      </form>
    </Paper>
  );
};

export default ManualEdit;
