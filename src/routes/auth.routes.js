import express from "express";
import { signIn, signOut, signUp } from "#controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-out", signOut);
router.post("/sign-in", signIn);

export default router;