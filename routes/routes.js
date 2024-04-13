import express from "express";
import authRoutes from "./auth.routes.js";
import speechRoutes from "./speaking.routes.js";

export default function (app) {
  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/speech", speechRoutes);
}
