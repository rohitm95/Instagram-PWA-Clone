import { Observable } from 'rxjs';

export interface Post {
    id: string;
    title: string;
    location: any;
    image?: string;
    date?: Date | number;
    address$?: Observable<string>;
}