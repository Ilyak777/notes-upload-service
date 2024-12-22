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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs/promises");
const path = require("path");
const uuid_1 = require("uuid");
let FilesService = class FilesService {
    constructor() {
        this.uploadDir = path.resolve(__dirname, '../../uploads');
        this.ensureUploadDirectory();
    }
    async ensureUploadDirectory() {
        try {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create uploads directory');
        }
    }
    async handleFileUpload(file) {
        const uniqueFileName = `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
        const filePath = path.join(this.uploadDir, uniqueFileName);
        try {
            await fs.writeFile(filePath, file.buffer);
            return `/uploads/${uniqueFileName}`;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to save file');
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FilesService);
//# sourceMappingURL=files.service.js.map