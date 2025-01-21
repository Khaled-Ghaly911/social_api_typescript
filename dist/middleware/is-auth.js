"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ message: "No token provided, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token missing, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token, authorization denied" });
    }
};
exports.default = isAuth;
//# sourceMappingURL=is-auth.js.map