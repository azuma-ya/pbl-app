import { createWSClient, httpBatchLink, wsLink } from "@trpc/client";

import { createCaller } from "@/trpc/server";

const getEngineLink = () => {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    });
  }

  return wsLink({
    client: createWSClient({
      url: `${process.env.NEXT_PUBLIC_AS_URL || "ws://localhost:3001"}`,
    }),
  });
};

//バックエンドtRPCクライアント
export const trpc = createCaller({
  links: [getEngineLink()],
});
