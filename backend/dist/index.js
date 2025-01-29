"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const databaseConnection_1 = __importDefault(require("./config/databaseConnection"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const emailVerificationRoutes_1 = __importDefault(require("./routes/emailVerificationRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://task-manager-frontend-ten-lyart.vercel.app",
        "http://localhost:5173",
    ],
    methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.send("Task Manager API Made by devken");
});
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/email-verification", emailVerificationRoutes_1.default);
app.use("/api/v1/tasks", taskRoutes_1.default);
const PORT = process.env.PORT || 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connect to database first
        yield (0, databaseConnection_1.default)();
        // listen to port
        app.listen(PORT, () => {
            console.log(`Server is up at port -> ${PORT}`);
        });
    }
    catch (error) {
        console.error(`Can't start server -> ${error}`);
    }
});
startServer();
