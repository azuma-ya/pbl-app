"use client";

import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import LogoutIcon from "@mui/icons-material/Logout";
import NotesIcon from "@mui/icons-material/Notes";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import type { School, User } from "@prisma/client";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavigarionProps {
  user: (User & { school: Pick<School, "id" | "name"> | null }) | null;
}

const Navigation = ({ user }: NavigarionProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    signOut();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {user ? (
          <>
            <Typography variant="h6" component="div" sx={{ mr: 2 }}>
              {user?.school?.name}
            </Typography>
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 2 }}
            >
              <Button
                LinkComponent={Link}
                color="secondary"
                variant="contained"
                href="/"
              >
                スレッド一覧
              </Button>
              <Button
                LinkComponent={Link}
                color="secondary"
                variant="contained"
                href="/manual"
              >
                マニュアル一覧
              </Button>
            </Box>
            <IconButton onClick={handleClick} sx={{ marginLeft: "auto" }}>
              <Avatar alt="avatar" src={user.image!} />
            </IconButton>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography variant="h6" component="div">
              PBL APP
            </Typography>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => signIn("google")}
            >
              ログイン
            </Button>
          </Box>
        )}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
            sx: { width: 300 },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box sx={{ margin: "0.5rem 1rem" }}>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="subtitle2">{user?.school?.name}</Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              handleClose();
              router.push("/");
            }}
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <NotesIcon />
            スレッド一覧
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              router.push("/manual");
            }}
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <ArticleIcon />
            マニュアル一覧
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              router.push("/thread/new");
            }}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <AddIcon />
            新規スレッド
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              router.push("/school/setting");
            }}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <SettingsIcon />
            学校設定
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <LogoutIcon />
            ログアウト
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
