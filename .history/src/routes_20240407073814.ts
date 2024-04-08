import { Request, Response, Router } from "express";
import { io } from "./app";

const router = Router();

router.post("/", (request: Request, response: Response): Promise<Response> => {
  const { name, age } = request.body;

  io.emit("user", { message: { name: name, age: age } });
  return;
});
