"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const env_1 = require("../config/env");
const User_1 = __importDefault(require("../models/User"));
const db_1 = require("../config/db");
const createAdmin = async () => {
    try {
        await (0, db_1.connectDB)();
        const existingAdmin = await User_1.default.findOne({ email: env_1.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }
        const admin = await User_1.default.create({
            email: env_1.env.ADMIN_EMAIL,
            passwordHash: env_1.env.ADMIN_PASSWORD,
        });
        console.log('Admin User Created:', admin.email);
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};
exports.createAdmin = createAdmin;
// createAdmin();
