"use client";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Link as MuiLink,
  Toolbar,
  Typography,
} from "@mui/material";
import { School, User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface NavigarionProps {
  user: (User & { school: Pick<School, "id" | "name"> | null }) | null;
}

const Navigation = ({ user }: NavigarionProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
            <IconButton onClick={handleClick}>
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
            <Button color="secondary" variant="contained">
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
          <Box sx={{ marginX: 2 }}>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="subtitle2">{user?.school?.name}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleClose}>
            <MuiLink
              component={Link}
              href="/school/setting"
              underline="none"
              color="inherit"
            >
              学校設定
            </MuiLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>新規スレッド</MenuItem>
          <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
