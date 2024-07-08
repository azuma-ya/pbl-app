"use client";

import { trpc } from "@/trpc/react";
import AddLinkIcon from "@mui/icons-material/AddLink";
import type { ButtonProps } from "@mui/material";
import {
  Box,
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
  alpha,
  useMediaQuery,
} from "@mui/material";
import type { Manual } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

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
    id: "content",
    numeric: false,
    disablePadding: false,
    label: "内容",
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: false,
    label: "更新日",
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
  isUpdate: boolean;
  changeSearchedHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
}

const EnhancedManualTableToolbar = ({
  numSelected,
  searched,
  isUpdate,
  changeSearchedHandler,
  onUpdate,
}: EnhancedManualTableToolbarProps) => {
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
          <Typography color="inherit" variant="subtitle1" component="div">
            {numSelected} 選択中
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{ margin: 2, width: "8rem", verticalAlign: "center" }}
          onClick={onUpdate}
          disabled={!isUpdate}
        >
          <AddLinkIcon sx={{ marginRight: 2 }} />
          更新
        </Button>
      </Box>
    </Toolbar>
  );
};

interface EnhancedManualTableProps {
  manuals: Manual[];
  selectedManuals: string[];
  isUpdate: boolean;
  onUpdate: () => void;
  onChangeSelected: (value: string[]) => void;
}

const EnhancedManualTable = ({
  manuals,
  selectedManuals,
  isUpdate,
  onUpdate,
  onChangeSelected,
}: EnhancedManualTableProps) => {
  const sm = useMediaQuery("(min-width:600px)");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = useState<string>("");
  const [rows, setRows] = useState(manuals);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      onChangeSelected(newSelected);
      return;
    }
    onChangeSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selectedManuals.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedManuals, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedManuals.slice(1));
    } else if (selectedIndex === selectedManuals.length - 1) {
      newSelected = newSelected.concat(selectedManuals.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedManuals.slice(0, selectedIndex),
        selectedManuals.slice(selectedIndex + 1),
      );
    }
    onChangeSelected(newSelected);
  };

  const requestSearch = (searchedVal: string) => {
    const filteredRows = manuals.filter((row) => {
      return row.title.toLowerCase().includes(searchedVal.toLowerCase());
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

  const handleUpdate = () => {
    onUpdate();
  };

  const isSelected = (id: string) => selectedManuals.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <EnhancedManualTableToolbar
        numSelected={selectedManuals.length}
        searched={searched}
        changeSearchedHandler={changeSearchedHandler}
        onUpdate={handleUpdate}
        isUpdate={isUpdate}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <EnhancedManualTableHead
            numSelected={selectedManuals.length}
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
                    {sm ? (
                      row.title
                    ) : (
                      <Button LinkComponent={Link} href={`/manual/${row.id}`}>
                        {row.title}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="left">{row.content.slice(0, 20)}</TableCell>
                  <TableCell align="right">
                    {format(new Date(row.updatedAt), "yyyy/MM/dd HH:mm")}
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

export interface ManualAddDialogProps {
  open: boolean;
  manuals: Manual[];
  selectedManuals: string[];
  isUpdate: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onChangeSelected: (value: string[]) => void;
}

const ManualAddDialog = ({
  open,
  manuals,
  selectedManuals,
  isUpdate,
  onClose,
  onUpdate,
  onChangeSelected,
}: ManualAddDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  const handleUpdate = () => {
    onUpdate();
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
      <DialogTitle>マニュアルを紐づける</DialogTitle>
      <EnhancedManualTable
        manuals={manuals}
        selectedManuals={selectedManuals}
        isUpdate={isUpdate}
        onUpdate={handleUpdate}
        onChangeSelected={handleChangeSelected}
      />
    </Dialog>
  );
};

interface ManualAddDialogButton extends ButtonProps {
  threadId: string;
  manuals: Manual[];
  linkedManuals: { manual: Manual }[];
}

const ManualAddDialogButton = ({
  threadId,
  manuals,
  linkedManuals,
  children,
  ...props
}: ManualAddDialogButton) => {
  const initialSelectedManuals = linkedManuals.map(
    (linkedManual) => linkedManual.manual.id,
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedManuals, setSelectedManuals] = useState(
    initialSelectedManuals,
  );

  const { mutate: updateLinkedManual } =
    trpc.thread.updateThreadLinkedManual.useMutation({
      onSuccess: () => {
        toast.success("マニュアル紐づけに更新に成功しました");
        router.refresh();
        setIsUpdate(false);
      },
      onError: (error) => {
        toast.error("マニュアル紐づけ更新に失敗しました");
        console.error(error);
      },
    });

  const handleUpdate = () => {
    updateLinkedManual({ threadId, manualIds: selectedManuals });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSelected = (value: string[]) => {
    setSelectedManuals(value);
    if (
      value.length === initialSelectedManuals.length &&
      value.every((item) => initialSelectedManuals.includes(item))
    ) {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  };
  return (
    <>
      <Button {...props} onClick={handleClickOpen}>
        {children}
      </Button>
      <ManualAddDialog
        manuals={manuals}
        selectedManuals={selectedManuals}
        isUpdate={isUpdate}
        open={open}
        onClose={handleClose}
        onUpdate={handleUpdate}
        onChangeSelected={handleChangeSelected}
      />
    </>
  );
};

export default ManualAddDialogButton;
