import { auth, signIn } from "@/auth"
import { Button } from "@mui/material"

const SignupPage = async () => {
  const session = await auth()
  console.log(session?.user)
  return (
    <div className="flex gap-4 flex-col h-screen items-center justify-center">
      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <Button type="submit" variant="contained">
          Signin with Google
        </Button>
      </form>
    </div>
  )
}

export default SignupPage
