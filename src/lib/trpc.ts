import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { isServer } from "solid-js/web";
import { AppRouter } from "~/server/router";

const baseForEnvironment = isServer ? "http://localhost:3000" : "";

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    // identifies what url will handle trpc requests
    httpBatchLink({ url: `${baseForEnvironment}/api/trpc` }),
  ],
});
