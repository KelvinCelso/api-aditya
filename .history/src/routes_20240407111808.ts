import { Request, Response, Router, request } from "express";
import { io } from "./app";
import Stripe from "stripe";
import express from "express";
const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.use(express.raw({ type: "application/json" }));
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
  } catch (error) {
    console.error("Error creating Checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),

  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const amount = session.amount_total / 100;
      console.log(amount);
    }

    res.sendStatus(200);
  }
);

export { router };
