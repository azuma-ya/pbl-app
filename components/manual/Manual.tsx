"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
const Manual = () => {
  return (
    <Box>
        <TextField>
          <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
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
        <RandomCardDisplay>

        </RandomCardDisplay>
        <DataTable>
        </DataTable>
    </Box>
  );
};

export default Manual;

 import {
   Avatar,
   Button,
   Card,
   CardActions,
   CardContent,
   CardHeader,
   Container,
   CssBaseline,
   Grid,
   List,
   ListItem,
   ListItemAvatar,
   ListItemText,
   Typography,
   Table,
   TableContainer,
   TableHead,
   TableRow,
   TableCell,
   TableBody,
   Paper,
 } from "@mui/material";
 import { useEffect, useState } from "react";
 //dbの位置がわからなかったのでダミーデータで代用しています。申し訳ございません。
 import { nameListData } from "./nameListData";

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

 export function SearchBoxDemo() {
   const [nameList, setNameList] = useState(nameListData);

  const filteringName = (inputValue: any) => {
    if (inputValue) {
      const filteredNames = nameListData.filter((name: any) =>
        name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setNameList(filteredNames);
    } else {
      setNameList(nameListData);
    }
  };

   return (
     <Box sx={{ flexGrow: 1 }}>
       <Box
         component="form"
         sx={{
           "& .MuiTextField-root": { m: 1, width: "25ch" },
         }}
         noValidate
         autoComplete="off"
       >
         <div>
           <TextField>
             required id="outlined-required" label="Required" defaultValue="Hello
             World"
           </TextField>
           <Box sx={{ display: "flex", justifyContent: "center" }}>
             <Grid container spacing={2}>
               <Grid item xs={2}>
                 <Box sx={{ height: "50vh", padding: "15px" }}>
                   <TextField
                     margin="normal"
                     fullWidth
                     onChange={(e) => filteringName(e.currentTarget.value)}
                   />
                 </Box>
               </Grid>
               <Grid item xs={2}>
                 <Box sx={{ height: "30vh", padding: "15px", overflow: "auto" }}>
                   <List>
                     {nameList.length > 0 ? (
                       nameList.map((name: any) => (
                         <ListItem key={name}>
                           <ListItemAvatar>
                             <Avatar>{name.substr(0, 1)}</Avatar>
                           </ListItemAvatar>
                           <ListItemText>{name}</ListItemText>
                         </ListItem>
                       ))
                     ) : (
                       <ListItem>
                         <ListItemText>
                           検索結果が見つかりませんでした
                         </ListItemText>
                       </ListItem>
                     )}
                   </List>
                 </Box>
               </Grid>
             </Grid>
           </Box>
         </div>
       </Box>
     </Box>
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
         manualId: '〇〇学校',
         threadId: 101,
         manualName: "Manual A",
         createdAt: "2023-07-01",
       },
       {
         manualId: '〇〇学校',
         threadId: 102,
         manualName: "Manual B",
         createdAt: "2023-07-02",
       },
       {
         manualId: '〇〇学校',
         threadId: 103,
         manualName: "Manual C",
         createdAt: "2023-07-03",
       },
       {
         manualId: '〇〇学校',
         threadId: 104,
         manualName: "Manual D",
         createdAt: "2023-07-04",
       },
       {
         manualId: '〇〇学校',
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
   const [rows, setRows] = useState([
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
     // 他の行データ
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
           <Table sx={{ minWidth: 650 }} aria-rabel="マニュアル一覧">
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
