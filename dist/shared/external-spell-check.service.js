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
exports.ExternalSpellCheckService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const axios_1 = require("axios");
let ExternalSpellCheckService = class ExternalSpellCheckService {
    constructor() {
        this.apiUrl = 'https://рандомный_урлик/api/check';
        this.httpClient = axios_1.default.create({
            baseURL: this.apiUrl,
            timeout: 5000,
        });
    }
    hashRequestData(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
    async checkSpell(content) {
        try {
            const hash = this.hashRequestData(content);
            const response = await this.httpClient.post('', { text: content }, {
                headers: {
                    'x-hash': hash,
                },
            });
            if (typeof response.data?.isValid !== 'boolean') {
                throw new common_1.HttpException('Unexpected response format from external service', common_1.HttpStatus.BAD_GATEWAY);
            }
            return response.data.isValid;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new common_1.HttpException(`Error calling external service: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
            }
            throw new common_1.HttpException('Unexpected error during spell check', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ExternalSpellCheckService = ExternalSpellCheckService;
exports.ExternalSpellCheckService = ExternalSpellCheckService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ExternalSpellCheckService);
//# sourceMappingURL=external-spell-check.service.js.map