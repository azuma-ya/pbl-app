import { auth, signIn, signOut } from "@/auth";
import { Button } from "@mui/material";

const DevPage = async () => {
  const session = await auth();
  console.log(session?.user);
  return (
    <div className="flex gap-4 flex-col h-screen items-center justify-center">
      {/* <Button
        type="submit"
        variant="contained"
        onClick={() => signIn('google')}
      >
        SignIn with Google
      </Button>
      <Button type="submit" variant="contained" onClick={() => signOut()}>
        SignOut
      </Button> */}
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
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">SignOut</button>
      </form>
    </div>
  );
};

export default DevPage;
