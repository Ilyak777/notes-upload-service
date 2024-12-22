"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const api_key_auth_guard_1 = require("./api-key-auth.guard");
let CompositeAuthGuard = class CompositeAuthGuard {
    static getGuards() {
        return [jwt_auth_guard_1.JwtAuthGuard, api_key_auth_guard_1.ApiKeyGuard];
    }
};
exports.CompositeAuthGuard = CompositeAuthGuard;
exports.CompositeAuthGuard = CompositeAuthGuard = __decorate([
    (0, common_1.Injectable)()
], CompositeAuthGuard);
//# sourceMappingURL=composite-auth.guard.js.map