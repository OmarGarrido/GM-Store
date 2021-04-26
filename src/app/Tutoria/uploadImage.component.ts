import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { FileItem } from './models/file-item';

@Component({
  selector: 'app-upload',
  templateUrl: './uploadImage.component.html',
  styleUrls: ['./uploadImage.component.css'],
  providers: [StorageService]
})
export class UploadImageComponent implements OnInit {
  files: FileItem[] = [];
  isOverDrop = false;


  constructor(private readonly storageServ: StorageService) { }

  ngOnInit(): void {
  }

  onUpload() {
    this.storageServ.uploadImage(this.files)
  }

}
