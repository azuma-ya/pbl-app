"use client";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import type { ReactNode } from "react";

export default function ThreadRooom({
  threadId,
  children,
}: {
  threadId: string;
  children: ReactNode;
}) {
  const client = new Ably.Realtime({ authUrl: "/api" });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={threadId}>{children}</ChannelProvider>
    </AblyProvider>
  );
}
