import { Request, Response, Router, request } from "express";
import { io } from "./app";
import Stripe from "stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

router.post("/create-checkout-session", async (req, res) => {
  const { amount, description, campaignId, billing_type, price_id } = req.body;

  try {
    if (billing_type === "ONE_TIME") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: description,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        metadata: {},
        mode: "payment",
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cancel`,
      });

      return res.json({ sessionId: session.url });
    }
    return res.status(400).json({ error: "one time subscription" });
  } catch (error) {
    console.error("Error creating Checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
