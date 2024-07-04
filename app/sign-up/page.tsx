import { auth, signIn } from "@/lib/auth";
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
        <Button type="submit" variant="contained">
          Signin with Google
        </Button>
      </form>
    </Box>
  );
};

export default SignupPage;
