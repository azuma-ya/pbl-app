import { signOut } from "@/auth";

export default function Home() {
  return (
    <>
      <h2>Pbl App</h2>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">SignOut</button>
      </form>
    </>
  );
}
