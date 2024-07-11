"use client";

import { ManualType } from "@/types/manual";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SimpleContainer() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ gray: "#cfe8fc", height: "100vh" }} />
      </Container>
    </>
  );
}

interface Manual {
  manualId: string;
  threadId: number;
  manualName: string;
  createdAt: string;
}

const getRandomItems = (items: Manual[], count: number): Manual[] => {
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const RandomCardDisplay = () => {
  const [cards, setCards] = useState<Manual[]>([]);

  useEffect(() => {
    // ここではダミーデータを使用します
    const dummyData = [
      {
        manualId: "〇〇学校",
        threadId: 101,
        manualName: "Manual A",
        createdAt: "2023-07-01",
      },
      {
        manualId: "〇〇学校",
        threadId: 102,
        manualName: "Manual B",
        createdAt: "2023-07-02",
      },
      {
        manualId: "〇〇学校",
        threadId: 103,
        manualName: "Manual C",
        createdAt: "2023-07-03",
      },
      {
        manualId: "〇〇学校",
        threadId: 104,
        manualName: "Manual D",
        createdAt: "2023-07-04",
      },
      {
        manualId: "〇〇学校",
        threadId: 105,
        manualName: "Manual E",
        createdAt: "2023-07-05",
      },
    ];

    // ランダムに5つのカードを選択
    const randomCards = getRandomItems(dummyData, 5);
    setCards(randomCards);
  }, []);

  return (
    <Container>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.manualId}>
            <Card>
              <CardHeader title={`学校名': ${card.manualId}`} />
              <CardContent>
                <Typography variant="h6">{card.manualName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Thread ID: {card.threadId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created At: {card.createdAt}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

interface Row {
  id: number;
  name: string;
  groupName: string;
  creator: string;
  createdAt: string;
}

interface DataTableProps {
  manuals: ManualType[];
}

const DataTable = ({ manuals }: DataTableProps) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searched, setSearched] = useState("");
  const [rows, setRows] = useState(manuals);

  const requestSearch = (searchedVal: string) => {
    const filteredRows = manuals.filter((row) => {
      return row.title?.toLowerCase().includes(searchedVal.toLowerCase());
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

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    router.push(`/manual/${id}`);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Grid
      justifyContent="center"
      style={{ marginTop: "20px", width: "100%", maxWidth: 900 }}
    >
      <Grid item xs={10}>
        <TextField
          label="検索する"
          variant="outlined"
          value={searched}
          onChange={changeSearchedHandler}
          style={{ marginBottom: "10px", width: "100% " }}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="マニュアル一覧">
            <TableHead>
              <TableRow>
                <TableCell>タイトル</TableCell>
                <TableCell>作成日</TableCell>
                <TableCell>更新日</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                >
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    {format(new Date(row.createdAt), "yyyy/MM/dd HH:mm")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(row.updatedAt), "yyyy/MM/dd HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
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
      </Grid>
    </Grid>
  );
};

interface ManualProps {
  manuals: ManualType[];
}

const Manual = ({ manuals }: ManualProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <DataTable manuals={manuals} />
    </Box>
  );
};

export default Manual;
