import express from "express";
import authRoutes from "./auth.routes.js";
import speechRoutes from "./speaking.routes.js";
import grammarRoutes from "./grammar.routes.js";
import userRoutes from "./user.routes.js";

export default function (app) {
  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/speech", speechRoutes);
  app.use("/grammar", grammarRoutes);
  app.use("/users", userRoutes);
}
