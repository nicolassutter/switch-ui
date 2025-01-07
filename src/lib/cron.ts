import { CronJob } from "cron";
import { updateDatabase } from "./lib";

// every day
export const cron = new CronJob(
  "0 0 0 * * *",
  () => {
    console.log("Cron job updating games");
    updateDatabase();
    console.log("Cron job done updating games");
  },
  null,
  false,
  "Europe/Paris"
);
