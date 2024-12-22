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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const note_entity_1 = require("./entities/note.entity");
const typeorm_2 = require("typeorm");
const external_spell_check_service_1 = require("../shared/external-spell-check.service");
let NotesService = class NotesService {
    constructor(noteRepository, spellCheckService, connection) {
        this.noteRepository = noteRepository;
        this.spellCheckService = spellCheckService;
        this.connection = connection;
    }
    async createNote(createNoteDto, user) {
        const isValid = await this.spellCheckService.checkSpell(createNoteDto.content);
        if (!isValid) {
            throw new common_1.ForbiddenException('Content failed spell check');
        }
        return await this.connection.transaction(async (manager) => {
            const note = this.noteRepository.create({
                title: createNoteDto.title,
                content: createNoteDto.content,
                fileUrl: createNoteDto.fileUrl,
                author: user || null,
            });
            return manager.save(note);
        });
    }
    async getNoteById(noteId, requester) {
        const note = await this.noteRepository.findOne({
            where: { id: noteId },
            relations: ['author'],
        });
        if (!note) {
            throw new common_1.NotFoundException('Note not found');
        }
        return this.applyVisibility(note, requester);
    }
    async updateNote(noteId, updateNoteDto, requester) {
        const note = await this.noteRepository.findOne({
            where: { id: noteId },
            relations: ['author'],
        });
        if (!note) {
            throw new common_1.NotFoundException('Note not found');
        }
        if (requester &&
            note.author &&
            note.author.id !== requester.id &&
            requester.role !== 'super-admin') {
            throw new common_1.ForbiddenException('You do not have permission to update this note');
        }
        if (updateNoteDto.content) {
            const isValid = await this.spellCheckService.checkSpell(updateNoteDto.content);
            if (!isValid) {
                throw new common_1.ForbiddenException('Content failed spell check');
            }
        }
        Object.assign(note, updateNoteDto);
        return this.noteRepository.save(note);
    }
    async deleteNote(noteId, requester) {
        const note = await this.noteRepository.findOne({
            where: { id: noteId },
            relations: ['author'],
        });
        if (!note) {
            throw new common_1.NotFoundException('Note not found');
        }
        if (requester &&
            note.author &&
            note.author.id !== requester.id &&
            requester.role !== 'super-admin') {
            throw new common_1.ForbiddenException('You do not have permission to delete this note');
        }
        await this.noteRepository.remove(note);
    }
    async getAllNotes(requester) {
        const notes = await this.noteRepository.find({ relations: ['author'] });
        return notes.map((note) => this.applyVisibility(note, requester));
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
    async getUserNotesCount(userId) {
        return this.noteRepository.count({ where: { author: { id: userId } } });
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(note_entity_1.Note)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        external_spell_check_service_1.ExternalSpellCheckService,
        typeorm_2.Connection])
], NotesService);
//# sourceMappingURL=notes.service.js.map