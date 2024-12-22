export declare class ExternalSpellCheckService {
    private readonly apiUrl;
    private readonly httpClient;
    constructor();
    private hashRequestData;
    checkSpell(content: string): Promise<boolean>;
}
