"use client";

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
import { Manual } from "@prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";

interface HeadCell {
  disablePadding: boolean;
  id: keyof Manual;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Title",
  },
  {
    id: "userId",
    numeric: false,
    disablePadding: false,
    label: "UserId",
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: false,
    label: "updatedAt",
  },
];

interface EnhancedManualTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedManualTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
}: EnhancedManualTableHeadProps) {
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
}

interface EnhancedManualTableToolbarProps {
  numSelected: number;
  searched: string;
  changeSearchedHandler: (event: any) => void;
}

const EnhancedManualTableToolbar = ({
  numSelected,
  searched,
  changeSearchedHandler,
}: EnhancedManualTableToolbarProps) => {
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

interface EnhancedManualTableProps {
  manuals: Manual[];
}

const EnhancedManualTable = ({ manuals }: EnhancedManualTableProps) => {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = useState<string>("");
  const [rows, setRows] = useState(manuals);

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
    const filteredRows = manuals.filter((row) => {
      return row.title.toLowerCase().includes(searchedVal.toLowerCase());
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
      <EnhancedManualTableToolbar
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
          <EnhancedManualTableHead
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
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.userId}</TableCell>
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

export interface ManualAddDialogProps {
  open: boolean;
  manuals: Manual[];
  selectedManuals: Manual[];
  onClose: (value: Manual[]) => void;
}

const ManualAddDialog = ({
  onClose,
  manuals,
  selectedManuals,
  open,
}: ManualAddDialogProps) => {
  const handleClose = () => {
    onClose(selectedManuals);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { minHeight: "50%" } }}
      maxWidth="lg"
    >
      <DialogTitle>マニュアルを紐づける</DialogTitle>
      <EnhancedManualTable manuals={manuals} />
    </Dialog>
  );
};

interface ManualAdd extends BoxProps {
  manuals: Manual[];
}

const ManualAdd = ({ manuals, ...props }: ManualAdd) => {
  const [open, setOpen] = useState(false);
  const [selectedManuals, setSelectedManuals] = useState<Manual[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: Manual[]) => {
    setOpen(false);
    setSelectedManuals(value);
  };
  return (
    <Box {...props}>
      <Button variant="contained" onClick={handleClickOpen}>
        マニュアルを追加する
      </Button>
      <ManualAddDialog
        manuals={manuals}
        selectedManuals={selectedManuals}
        open={open}
        onClose={handleClose}
      />
    </Box>
  );
};

export default ManualAdd;
