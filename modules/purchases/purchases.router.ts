import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../../config";
import { StatusCode } from "../../toolkit";
import { isAuthenticated } from "../authentication/authentication.middlewares";
import { IPostModel, IPostModelWithId } from "../posts/posts.models";
import express from "express";
import PurchasesController from "./purchases.controller";

const stripe = new Stripe(config.stripeKey, {
  apiVersion: "2022-11-15",
});

const router = Router();

// ON DEPLOY CHANGE THE WEBHOOK HTTP URL+ the image url
router.post("/create-checkout-session", isAuthenticated, async (req, res) => {
  console.log("CHECKOUT");
  const { statusCode, body } = await PurchasesController.createCheckoutSession(
    req,
    req.body
  );
  res.status(statusCode).send(body);
});

// /api/purchases/webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const { statusCode, body } = await PurchasesController.stripeWebhook(req);
    res.status(statusCode).send(body);
  }
);

export default router;
