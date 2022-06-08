export const socketConfig = Object.freeze({
  SERVER_OPTIONS: {
    cors: {
      origin: "*",
    },
    transports: ["websocket", "polling"],
  },
});
