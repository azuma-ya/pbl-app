import { auth, signIn } from "@/lib/auth";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button } from "@mui/material";

const SignupPage = async () => {
  const session = await auth();
  console.log(session?.user);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button
          type="submit"
          variant="contained"
          sx={{ padding: "1rem 2rem", verticalAlign: "center" }}
        >
          <GoogleIcon
            sx={{
              marginRight: "1rem",
              width: "1.5rem",
              height: "1.5rem",
            }}
          />
          Googleアカウント
        </Button>
      </form>
    </Box>
  );
};

export default SignupPage;
