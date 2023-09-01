import express from "express";
import { BookRoutes } from "../app/modules/books/books.route";
import { UserRoutes } from "../app/modules/users/users.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/books",
    route: BookRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
