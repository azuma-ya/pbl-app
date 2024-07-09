"use client";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import type { ThreadWithUsesrManuals } from "@/types/thread";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const ThreadStatus = ({ thread }: { thread: ThreadWithUsesrManuals }) => {
  let status: React.ReactNode;
  switch (thread.status) {
    case "ACTIVE":
      status = <Chip label="進行中" />;
      break;
    case "CLOSED":
      status = <Chip label="解決済み" />;
      break;
    case "INACTIVE":
      status = <Chip label="アーカイブ" />;
      break;
    case "PREPARING_MANUAL":
      status = <Chip label="マニュアル作成準備中" />;
      break;
  }
  return status;
};

interface ThreadProps {
  threads: ThreadWithUsesrManuals[];
}

const Thread = ({ threads }: ThreadProps) => {
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - threads.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleClick = (id: string) => {
    router.push(`/thread/${id}`);
  };

  return (
    <Box>
      <TableContainer sx={{ width: "100%", marginY: "10rem" }}>
        <Table
          sx={{ width: "100%", minWidth: 1000 }}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow>
              <TableCell>作成者名</TableCell>
              <TableCell align="right">タイトル</TableCell>
              <TableCell align="right">ステータス</TableCell>
              <TableCell align="right">作成日</TableCell>
              <TableCell align="right">更新日</TableCell>
              <TableCell align="right">マニュアル</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? threads.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : threads
            ).map((row) => (
              <TableRow
                hover
                key={row.id}
                sx={{ cursor: "pointer" }}
                onClick={() => handleClick(row.id)}
              >
                <TableCell component="th" scope="row">
                  {row.user?.name + " 先生"}
                </TableCell>
                <TableCell style={{ flex: 1 }} align="right">
                  {row.title}
                </TableCell>
                <TableCell style={{ width: 130 }} align="right">
                  <ThreadStatus thread={row} />
                </TableCell>
                <TableCell style={{ width: 130 }} align="right">
                  {format(new Date(row.createdAt), "yyyy/MM/dd HH:mm")}
                </TableCell>
                <TableCell style={{ width: 130 }} align="right">
                  {format(new Date(row.updatedAt), "yyyy/MM/dd HH:mm")}
                </TableCell>
                <TableCell style={{ width: 130 }} align="right">
                  {row.manuals[0] ? (
                    <Button
                      variant="contained"
                      LinkComponent={Link}
                      href={`/manual/${row.manuals[0].id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      閲覧
                    </Button>
                  ) : (
                    <Button variant="contained" disabled>
                      未作成
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={7}
                count={threads.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ paddingX: "4rem", paddingY: "1rem" }}
          LinkComponent={Link}
          href="/thread/new"
        >
          新規スレッド作成
        </Button>
      </Box>
    </Box>
  );
};

export default Thread;
