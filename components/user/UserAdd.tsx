"use client";

import { UserWithRoles } from "@/types/user";
import AddLinkIcon from "@mui/icons-material/AddLink";
import {
  alpha,
  Box,
  BoxProps,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";

interface HeadCell {
  disablePadding: boolean;
  id: keyof UserWithRoles;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "名前",
  },
  {
    id: "roles",
    numeric: false,
    disablePadding: false,
    label: "役職",
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: false,
    label: "updatedAt",
  },
];

interface EnhancedUserTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

const EnhancedUserTableHead = ({
  onSelectAllClick,
  numSelected,
  rowCount,
}: EnhancedUserTableHeadProps) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface EnhancedUserTableToolbarProps {
  numSelected: number;
  searched: string;
  changeSearchedHandler: (event: any) => void;
}

const EnhancedUserTableToolbar = ({
  numSelected,
  searched,
  changeSearchedHandler,
}: EnhancedUserTableToolbarProps) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      <TextField
        label="Search"
        value={searched}
        onChange={(event: any) => changeSearchedHandler(event)}
        variant="filled"
      />
      {numSelected > 0 && (
        <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <Typography color="inherit" variant="subtitle1" component="div">
            {numSelected} 選択中
          </Typography>
          <Button
            variant="contained"
            sx={{ margin: 2, width: "8rem", verticalAlign: "center" }}
          >
            <AddLinkIcon sx={{ marginRight: 2 }} />
            更新
          </Button>
        </Box>
      )}
    </Toolbar>
  );
};

interface EnhancedUserTableProps {
  users: UserWithRoles[];
}

export const EnhancedUserTable = ({ users }: EnhancedUserTableProps) => {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = useState<string>("");
  const [rows, setRows] = useState(users);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const requestSearch = (searchedVal: string) => {
    const filteredRows = users.filter((row) => {
      return row.name?.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const changeSearchedHandler = (event: any) => {
    setSearched(event.target.value);
    requestSearch(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <EnhancedUserTableToolbar
        numSelected={selected.length}
        searched={searched}
        changeSearchedHandler={changeSearchedHandler}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <EnhancedUserTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={rows.length}
          />
          <TableBody>
            {rows.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.roles.toString()}</TableCell>
                  <TableCell align="right">
                    {format(new Date(row.updatedAt), "yyyy/MM/dd HH:mm")}
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export interface UserAddDialogProps {
  open: boolean;
  users: UserWithRoles[];
  selectedUsers: UserWithRoles[];
  onClose: (value: UserWithRoles[]) => void;
}

const UserAddDialog = ({
  onClose,
  users,
  selectedUsers,
  open,
}: UserAddDialogProps) => {
  const handleClose = () => {
    onClose(selectedUsers);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { minHeight: "50%" } }}
      maxWidth="lg"
    >
      <DialogTitle>マニュアルを紐づける</DialogTitle>
      <EnhancedUserTable users={users} />
    </Dialog>
  );
};

interface ManualAdd extends BoxProps {
  users: UserWithRoles[];
}

const UserAdd = ({ users, ...props }: ManualAdd) => {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserWithRoles[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: UserWithRoles[]) => {
    setOpen(false);
    setSelectedUsers(value);
  };
  return (
    <Box {...props}>
      <Button variant="contained" onClick={handleClickOpen}>
        マニュアルを追加する
      </Button>
      <UserAddDialog
        users={users}
        selectedUsers={selectedUsers}
        open={open}
        onClose={handleClose}
      />
    </Box>
  );
};

export default UserAdd;
