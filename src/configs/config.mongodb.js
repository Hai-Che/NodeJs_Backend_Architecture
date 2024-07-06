"use strict";

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 8080,
  },
  db: {
    host: process.env.DEV_DBS_HOST || "localhost",
    port: process.env.DEV_DBS_PORT || 27017,
    name: process.env.DEV_DBS_NAME || "shopDEV",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 8080,
  },
  db: {
    host: process.env.PRO_DBS_HOST || "localhost",
    port: process.env.PRO_DBS_PORT || 27017,
    name: process.env.PRO_DBS_NAME || "shopDEV",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
export default config[env];
