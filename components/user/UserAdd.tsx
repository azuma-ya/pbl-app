"use client";

import type { UserWithRoles } from "@/types/user";
import GroupsIcon from "@mui/icons-material/Groups";
import type { ButtonProps, TableCellProps } from "@mui/material";
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
  alpha,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";

interface HeadCell {
  disablePadding: boolean;
  id: keyof UserWithRoles;
  label: string;
  numeric: boolean;
  props?: TableCellProps;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "名前",
    props: {
      sx: { width: 120 },
    },
  },
  {
    id: "roles",
    numeric: false,
    disablePadding: false,
    label: "役職",
    props: {
      sx: { flex: 1 },
    },
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
            {...headCell.props}
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
  isUpdate: boolean;
  changeSearchedHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate?: () => void;
}

const EnhancedUserTableToolbar = ({
  numSelected,
  searched,
  isUpdate,
  changeSearchedHandler,
  onUpdate,
}: EnhancedUserTableToolbarProps) => {
  const sm = useMediaQuery("(min-width:600px)");

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
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          changeSearchedHandler(event)
        }
        variant="filled"
      />
      <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
        {numSelected > 0 && sm && (
          <Typography
            color="inherit"
            variant="subtitle1"
            component="div"
            sx={{ marginRight: 2 }}
          >
            {numSelected} 選択中
          </Typography>
        )}
        {onUpdate && (
          <Button
            variant="contained"
            sx={{ margin: 2, width: "8rem", verticalAlign: "center" }}
            onClick={onUpdate}
            disabled={!isUpdate}
          >
            <GroupsIcon sx={{ marginRight: 2 }} />
            更新
          </Button>
        )}
      </Box>
    </Toolbar>
  );
};

interface EnhancedUserTableProps {
  users: UserWithRoles[];
  selectedUsers: string[];
  isUpdate: boolean;
  onUpdate?: () => void;
  onChangeSelected: (value: string[]) => void;
}

export const EnhancedUserTable = ({
  users,
  selectedUsers,
  isUpdate,
  onUpdate,
  onChangeSelected,
}: EnhancedUserTableProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = useState("");
  const [rows, setRows] = useState(users);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      onChangeSelected(newSelected);
      return;
    }
    onChangeSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1),
      );
    }
    onChangeSelected(newSelected);
  };

  const requestSearch = (searchedVal: string) => {
    const filteredRows = users.filter((row) => {
      return row.name?.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const changeSearchedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const isSelected = (id: string) => selectedUsers.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <EnhancedUserTableToolbar
        numSelected={selectedUsers.length}
        searched={searched}
        changeSearchedHandler={changeSearchedHandler}
        onUpdate={onUpdate}
        isUpdate={isUpdate}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <EnhancedUserTableHead
            numSelected={selectedUsers.length}
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
                    {row.name + " 先生"}
                  </TableCell>
                  <TableCell align="left" sx={{ display: "flex", gap: 1 }}>
                    {row.roles.map((roleUser) => (
                      <Chip key={roleUser.role.id} label={roleUser.role.name} />
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
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
  selectedUsers: string[];
  isUpdate: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  onChangeSelected: (value: string[]) => void;
}

const UserAddDialog = ({
  open,
  users,
  selectedUsers,
  isUpdate,
  onClose,
  onUpdate,
  onChangeSelected,
}: UserAddDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  const handleChangeSelected = (value: string[]) => {
    onChangeSelected(value);
  };
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { minHeight: "50%" } }}
      maxWidth="lg"
    >
      <DialogTitle>職員を追加する</DialogTitle>
      <EnhancedUserTable
        users={users}
        selectedUsers={selectedUsers}
        isUpdate={isUpdate}
        onUpdate={onUpdate}
        onChangeSelected={handleChangeSelected}
      />
    </Dialog>
  );
};

interface UserAddButton extends ButtonProps {
  users: UserWithRoles[];
  subscriberIds: string[];
  onChangeSubscriberIds: (subscriberIds: string[]) => void;
  onUpdate?: () => void;
}

const UserAddButton = ({
  users,
  subscriberIds,
  onChangeSubscriberIds,
  onUpdate,
  ...props
}: UserAddButton) => {
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSelected = (value: string[]) => {
    onChangeSubscriberIds(value);
    if (
      value.length === subscriberIds.length &&
      value.every((item) => subscriberIds.includes(item))
    ) {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  };
  return (
    <>
      <Button {...props} onClick={handleClickOpen}>
        職員を追加する
      </Button>
      <UserAddDialog
        users={users}
        selectedUsers={subscriberIds}
        isUpdate={isUpdate}
        open={open}
        onClose={handleClose}
        onUpdate={onUpdate}
        onChangeSelected={handleChangeSelected}
      />
    </>
  );
};

export default UserAddButton;
