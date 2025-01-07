import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "~/server/router";

const base = "http://localhost:3000";

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    // identifies what url will handle trpc requests
    httpBatchLink({ url: `${base}/api/trpc` }),
  ],
});
