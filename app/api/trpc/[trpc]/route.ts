import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/trpc/server";

export const dynamic = "force-dynamic";

export const maxDuration = 59;

export const config = {
  maxDuration: 59,
};

const handlers = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
};

export { handlers as GET, handlers as POST };
