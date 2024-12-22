export declare class FilesService {
    private readonly uploadDir;
    constructor();
    private ensureUploadDirectory;
    handleFileUpload(file: Express.Multer.File): Promise<string>;
}
