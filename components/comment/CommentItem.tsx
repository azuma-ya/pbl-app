import { Box, Checkbox, Paper, Typography } from "@mui/material";
import { Comment, User } from "@prisma/client";

interface CommentItemProps {
  comment: Comment & { user: Pick<User, "id" | "name" | "image"> | null };
  userId: string;
}

const CommentItem = ({ comment, userId }: CommentItemProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: comment.userId === userId ? "space-between" : "left",
      }}
    >
      <Checkbox size="small" defaultChecked />
      <Box sx={{}}>
        {comment.user && (
          <Typography variant="body1" component="p">
            {comment.user.name}
          </Typography>
        )}
        <Paper sx={{ textAlign: "center", padding: "1rem 2rem" }}>
          {comment.content}
        </Paper>
      </Box>
    </Box>
  );
};
export default CommentItem;
