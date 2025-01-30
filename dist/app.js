"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const comment_1 = __importDefault(require("./routes/comment"));
const like_1 = __importDefault(require("./routes/like"));
const post_1 = __importDefault(require("./routes/post"));
const follow_1 = __importDefault(require("./routes/follow"));
const sequelize_1 = require("./util/sequelize");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// import routes 
app.use('/auth', auth_1.default);
app.use('/comment', comment_1.default);
app.use('/follow', follow_1.default);
app.use('/like', like_1.default);
app.use('/post', post_1.default);
(0, sequelize_1.connectDB)();
app.listen(3000);
//# sourceMappingURL=app.js.map