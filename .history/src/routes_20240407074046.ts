import { Request, Response, Router } from "express";
import { io } from "./app";

const router = Router();

router.post(
  "/",
  async (request: Request, response: Response): Promise<Response> => {
    try {
      const { name, age } = request.body;

      io.emit("user", { message: { name: name, age: age } });
      return response.status(201).json({ name: name, age: age });
    } catch (err) {
      response.status(400).json({ message: "could not create user" });
    }
  }
);

export { router };
