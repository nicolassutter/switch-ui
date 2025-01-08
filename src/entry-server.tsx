// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { cron } from "./lib/cron";

// start cron job to update database
if (!cron.running) {
  cron.start();
  console.log("Cron job started");
}

export default createHandler(() => {
  return (
    <StartServer
      document={({ assets, children, scripts }) => {
        return (
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link rel="icon" href="/favicon.ico" />
              {assets}
            </head>
            <body>
              <div id="app">{children}</div>
              {scripts}
            </body>
          </html>
        );
      }}
    />
  );
});
