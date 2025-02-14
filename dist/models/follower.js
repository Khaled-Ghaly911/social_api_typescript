"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follower = void 0;
// src/models/Follower.ts
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = require("./user");
let Follower = class Follower extends sequelize_typescript_1.Model {
};
exports.Follower = Follower;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Follower.prototype, "followerId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Follower.prototype, "followingId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.User, { foreignKey: 'followerId', as: 'follower' }),
    __metadata("design:type", user_1.User)
], Follower.prototype, "follower", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.User, { foreignKey: 'followingId', as: 'following' }),
    __metadata("design:type", user_1.User)
], Follower.prototype, "following", void 0);
exports.Follower = Follower = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'followers' })
], Follower);
//# sourceMappingURL=follower.js.map