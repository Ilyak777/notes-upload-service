"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisibilityInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let VisibilityInterceptor = class VisibilityInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const requester = req.user;
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (Array.isArray(data)) {
                return data.map((note) => this.applyVisibility(note, requester));
            }
            else {
                return this.applyVisibility(data, requester);
            }
        }));
    }
    applyVisibility(note, requester) {
        if (!requester) {
            return {
                id: note.id,
                title: note.title,
                content: undefined,
            };
        }
        if (note.author && note.author.id === requester.id) {
            return note;
        }
        if (requester.role === 'super-admin') {
            return note;
        }
        return {
            id: note.id,
            title: note.title,
            content: undefined,
        };
    }
};
exports.VisibilityInterceptor = VisibilityInterceptor;
exports.VisibilityInterceptor = VisibilityInterceptor = __decorate([
    (0, common_1.Injectable)()
], VisibilityInterceptor);
//# sourceMappingURL=visibility.interceptor.js.map