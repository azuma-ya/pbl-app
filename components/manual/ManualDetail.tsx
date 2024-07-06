import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Box,
  Button,
  Chip,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Manual } from "@prisma/client";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ManualDetailProps {
  manual: Manual;
  userId: string;
}

const ManualDetail = ({ manual, userId }: ManualDetailProps) => {
  return (
    <Paper elevation={8} sx={{ padding: 4, margin: 4 }}>
      <Stack spacing={4}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button LinkComponent={Link} href={`/thread/${manual.threadId}`}>
            <ArrowBackIcon sx={{ marginRight: 1 }} fontSize="small" />
            スレッドに戻る
          </Button>
          <Button
            LinkComponent={Link}
            href={`/manual/${manual.id}/edit`}
            variant="contained"
          >
            <EditNoteIcon sx={{ marginRight: 1 }} fontSize="small" />
            編集する
          </Button>
        </Box>
        <Typography variant="h3" component="h1">
          {manual.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            gap: 2,
          }}
        >
          <Chip
            label={"作成日 " + format(new Date(manual.createdAt), "yyyy/MM/dd")}
          />
          <Chip
            label={
              "最終更新 " + format(new Date(manual.updatedAt), "yyyy/MM/dd")
            }
          />
        </Box>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {manual.content}
        </ReactMarkdown>
      </Stack>
    </Paper>
  );
};

export default ManualDetail;
