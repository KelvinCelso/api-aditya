import { Request, Response, Router, request } from "express";
import { io } from "./app";

const router = Router();

router.post(
  "/",
  async (request: Request, response: Response): Promise<Response> => {
    try {
      const { name, age } = request.body;

      io.emit("message", { message: { name: name, age: age } });
      return response.status(201).json({ name: name, age: age });
    } catch (err) {
      response.status(400).json({ message: "could not create user" });
    }
  }
);

router.get(
  "/",
  async (request: Request, response: Response): Promise<Response> => {
    return response.status(200).json({ message: "Hello Aditya" });
  }
);

export { router };
