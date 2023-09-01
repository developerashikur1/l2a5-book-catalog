"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_route_1 = require("../app/modules/books/books.route");
const users_route_1 = require("../app/modules/users/users.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: users_route_1.UserRoutes,
    },
    {
        path: "/books",
        route: books_route_1.BookRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
