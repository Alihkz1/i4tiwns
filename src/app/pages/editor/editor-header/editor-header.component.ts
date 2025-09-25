import { Component, inject } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditorApiService } from '../shared/api/editor-api.service';
import { FileTypes } from '../shared/enums/file-types.enum';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EditorFacade } from '../shared/facade/editor.facade';

@Component({
  selector: 'app-editor-header',
  imports: [NzIconModule,],
  templateUrl: './editor-header.component.html',
  styleUrl: './editor-header.component.scss'
})
export class EditorHeaderComponent {
  editorApi = inject(EditorApiService)
  editorFacade = inject(EditorFacade)
  notification = inject(NzNotificationService)

  onUpload() {
    const uploadInput = document.getElementById('upload')
    uploadInput?.click()
  }

  onSave() {
    this.editorFacade.trigSave()
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.type != FileTypes.SVG) {
        this.fileTypeWarnNotification()
        return
      }
      this.editorApi.uploadSvg(file).subscribe();
    }
  }

  fileTypeWarnNotification(): void {
    this.notification
      .warning(
        'Wrong SVG',
        'You are allowed to upload SVG files!'
      )
  }

}
