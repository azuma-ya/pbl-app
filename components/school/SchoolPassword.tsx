"use client";

import RhfTextField from "@/components/ui/RhfTextField";
import { trpc } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

//入力データの検証ルールを定義
const schema = z
  .object({
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

const SchoolPassword = () => {
  const router = useRouter();

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      repeatedPassword: "",
    },
  });

  const { mutate: updateUserSchool, isLoading } =
    trpc.school.updateSchool.useMutation({
      onSuccess: async () => {
        toast.success("パスワードを更新しました。");
        router.refresh();
      },
      onError: (error) => {
        toast.error("パスワードの更新に失敗しました");
        console.error(error);
      },
    });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    updateUserSchool({
      password: data.password,
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "2rem",
      }}
      component={"form"}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <RhfTextField
        id="outlined-password-input"
        label="合言葉の設定"
        type="password"
        autoComplete="current-password"
        sx={{ width: "100%", maxWidth: "40rem" }}
        name="password"
        control={form.control}
      />
      <RhfTextField
        id="outlined-password-input"
        label="確認"
        type="password"
        autoComplete="current-password"
        sx={{ width: "100%", maxWidth: "40rem" }}
        name="repeatedPassword"
        control={form.control}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          width: "100%",
          maxWidth: "40rem",
          paddingY: "0.7rem",
          marginTop: "4rem",
        }}
        disabled={isLoading}
      >
        決定
      </Button>
    </Box>
  );
};

export default SchoolPassword;
