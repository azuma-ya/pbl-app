import { getPusherInstance } from "@/lib/pusher/server";

export const dynamic = "force-dynamic";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  console.log("authenticating pusher perms...");
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);

  return new Response(JSON.stringify(authResponse));
}
