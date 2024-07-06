"use client";

import SchoolAddButton from "@/components/school/SchoolAdd";
import SchoolParticipateButton from "@/components/school/SchoolParicipate";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import type { School } from "@prisma/client";
import type { ChangeEvent} from "react";
import { useState } from "react";

interface SchoolSelectProps {
  schools: School[];
  userId: string;
}

const SchoolSelect = ({ schools, userId }: SchoolSelectProps) => {
  const [rows, setRows] = useState(schools);
  const [searched, setSearched] = useState("");

  const requestSearch = (searchedVal: string) => {
    const filteredRows = schools.filter((row) => {
      return row.name?.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const changeSearchedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearched(event.target.value);
    requestSearch(event.target.value);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%", marginY: 8 }}>
      <Box>
        <TextField
          label="学校名"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            changeSearchedHandler(event)
          }
          value={searched}
        />
      </Box>
      <List
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          width: "100%",
          overflow: "auto",
          height: 600,
        }}
      >
        {rows.map((row) => (
          <ListItem
            key={row.id}
            secondaryAction={
              <SchoolParticipateButton
                userId={userId}
                school={row}
                variant="contained"
              >
                参加する
              </SchoolParticipateButton>
            }
          >
            <ListItemText primary={row.name} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ textAlign: "end" }}>
        <SchoolAddButton userId={userId}>学校を追加する</SchoolAddButton>
      </Box>
    </Stack>
  );
};

export default SchoolSelect;
