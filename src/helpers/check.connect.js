"use strict";
import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECONDS = 5000;

const countConnect = () => {
  const numberOfConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numberOfConnection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numberOfConnection = mongoose.connections.length;
    const numberOfCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numberOfCore * 5;
    console.log(`Active connections: ${numberOfConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numberOfConnection > maxConnections) {
      console.log("Server overload");
    }
  }, _SECONDS);
};

export { countConnect, checkOverload };
