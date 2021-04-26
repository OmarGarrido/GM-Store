import { FileItem } from "../file-item";

export class ImageValidator {

    private acceptType = ['image/jpeg', 'image/png'];
    validaType(fileType: string): boolean {
        return fileType == '' || fileType == undefined
            ? false
            : this.acceptType.includes(fileType);
    }

    checkDropped(fileName: string, files: FileItem[]) {
        for (const file of files) {
            if (file.name == fileName) {
                return true
            } 
        }
        return false;
    }

}