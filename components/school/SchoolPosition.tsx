"use client";

import RoleNewButton from "@/components/role/RoleNew";
import { trpc } from "@/trpc/react";
import type { UserWithRoles } from "@/types/user";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import type { Role } from "@prisma/client";
import * as React from "react";
import toast from "react-hot-toast";

interface SchoolPositionProps {
  users: UserWithRoles[];
  roles: Role[];
}

const SchoolPosition = ({ users, roles }: SchoolPositionProps) => {
  const [selectedUser, setSelectedUser] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);

  const { mutate: createUserRole, isLoading: createUserRoleLoading } =
    trpc.user.craeteUserRole.useMutation({
      onSuccess: () => {
        toast.success("役職の紐づけに成功しました");
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
    });

  const { mutate: updateIsAdmin, isLoading: updateIsAdminLoading } =
    trpc.user.updateAdmin.useMutation({
      onSuccess: () => {
        toast.success("権限の更新に成功しました");
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
    });

  const { mutate: getUserById } = trpc.user.getUserById.useMutation({
    onSuccess: (user) => {
      setIsAdmin(user?.isAdmin || false);
    },
  });

  const handleChangeUesr = (event: SelectChangeEvent) => {
    setSelectedUser(event.target.value as string);
    getUserById({ userId: event.target.value as string });
  };

  const handleChangeRole = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as string);
  };

  const handleChangeIsAdmin = () => {
    setIsAdmin((prev) => !prev);
  };

  const handleUpdate = () => {
    if (selectedUser === "") {
      toast.error("職員を選択してください");
      return;
    }

    if (selectedRole !== "") {
      createUserRole({ userId: selectedUser, roleId: selectedRole });
    }
    updateIsAdmin({ userId: selectedUser, isAdmin });
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
        gap: "6rem",
      }}
    >
      <Box sx={{ width: "100%", minWidth: "20rem", maxWidth: "24rem" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">教員名</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedUser}
            label="教員名"
            onChange={handleChangeUesr}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name + " 先生"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: "100%", minWidth: "20rem", maxWidth: "24rem" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">役職</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="役職"
            value={selectedRole}
            onChange={handleChangeRole}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
          <RoleNewButton sx={{ marginLeft: "auto", display: "block" }}>
            役職を追加する
          </RoleNewButton>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Checkbox checked={isAdmin} onClick={handleChangeIsAdmin} />
        権限設定
      </Box>
      <Box sx={{ width: "100%", maxWidth: "50rem" }}>
        <Button
          variant="contained"
          sx={{
            width: "100%",
            maxWidth: "50rem",
            paddingY: "1rem",
            marginBottom: "1rem",
          }}
          onClick={handleUpdate}
          disabled={createUserRoleLoading || updateIsAdminLoading}
        >
          更新
        </Button>
      </Box>
    </Box>
  );
};

export default SchoolPosition;
