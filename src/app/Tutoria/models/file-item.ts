import { Observable } from "rxjs"

export class FileItem {
    public name: string;
    public uploading: boolean;
    public uploadPercent: Observable<number>;
    public dowloadLink: Observable<string>;

    constructor(
        public file: File = file) {
        this.name = file.name;
    }
}