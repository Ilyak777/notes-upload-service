import { JwtAuthGuard } from './jwt-auth.guard';
export declare class CompositeAuthGuard {
    static getGuards(): (typeof JwtAuthGuard)[];
}
