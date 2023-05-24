import express from "express";
const app = express();

import UsersRouter from "./users/users.router";
import AuthRouter from "./authentication/authentication.router";
import PostsRouter from "./posts/posts.router";
import PurchasesRouter from "./purchases/purchases.router";

app.use("/users/", UsersRouter);
app.use("/auth/", AuthRouter);
app.use("/posts/", PostsRouter);
app.use("/purchases/", PurchasesRouter);

export default app;
