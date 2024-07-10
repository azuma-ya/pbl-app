"use client";

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
  TableRow,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

const Manual = () => {
  return (
    <Box>
      <TextField>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              id="outlined-required"
              label="Required"
              defaultValue="Hello World"
            />
          </div>
        </Box>
      </TextField>
      <RandomCardDisplay />
      <DataTable />
    </Box>
  );
};

export default Manual;

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

const DataTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows] = useState<Row[]>([
    {
      id: 1,
      name: "Document A",
      groupName: "Group 1",
      creator: "John Doe",
      createdAt: "2023-07-01",
    },
    {
      id: 2,
      name: "Document B",
      groupName: "Group 2",
      creator: "Jane Smith",
      createdAt: "2023-07-02",
    },
    {
      id: 3,
      name: "Document C",
      groupName: "Group 1",
      creator: "Michael Johnson",
      createdAt: "2023-07-03",
    },
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.createdAt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
      <Grid item xs={10}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: "10px", width: "100% " }}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="マニュアル一覧">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Group Name</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.groupName}</TableCell>
                  <TableCell>{row.creator}</TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
