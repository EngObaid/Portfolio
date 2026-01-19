"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    FRONTEND_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
    MONGO_URI: zod_1.z.string().default('mongodb://localhost:27017/portfolio'),
    JWT_SECRET: zod_1.z.string().default('change_me_secretttt'),
    ADMIN_EMAIL: zod_1.z.string().default('admin@example.com'),
    ADMIN_PASSWORD: zod_1.z.string().default('change_me'),
});
exports.env = envSchema.parse(process.env);
