import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FileItem } from '../models/file-item';
import { ImageValidator } from '../models/helper/imageValidators';

@Directive({
  selector: '[appNgImagesFiles]'
})
export class NgImagesFilesDirective extends ImageValidator {
  @Input() files: FileItem[] = [];
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter();

  @HostListener('dragover', ['$event'])
  onDragEnter(event: any) {
    this.preventAndStop(event);
    this.mouseOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave() {
    this.mouseOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    const dataTransfer = this.getDataTransfer(event);
    if (!dataTransfer) {
      return
    }
    this.preventAndStop(event);
    this.extractFIles(dataTransfer.files);
    this.mouseOver.emit(false);
  }


  private getDataTransfer(event: any) {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  private extractFIles(fileList: FileList): void {
    for (const property in Object.getOwnPropertyNames(fileList)) {
      const tempFile = fileList[property];
      if (this.canBeUploaded(tempFile)) {
        const newFile = new FileItem(tempFile);
        this.files.push(newFile);
      }
    }
  }

  private canBeUploaded(file: File): boolean {
    if (!this.checkDropped(file.name, this.files) && this.validaType(file.type)) {
      return true;
    } else {
      return false;
    }
  }

  private preventAndStop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

}
