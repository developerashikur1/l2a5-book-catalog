import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

let server: Server;

async function root() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log("port is running on: ", config.port);
    });
  } catch (error) {
    console.log(error);
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    }
    process.exit(1);
  });
}

root();

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if (server) {
    server.close();
  }
});
