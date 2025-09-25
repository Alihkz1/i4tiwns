import { Component, inject } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SvgApiService } from '../shared/api/editor-api.service';
import { FileTypes } from '../shared/enums/file-types.enum';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-editor-header',
  imports: [NzIconModule,],
  templateUrl: './editor-header.component.html',
  styleUrl: './editor-header.component.scss'
})
export class EditorHeaderComponent {
  svgApi = inject(SvgApiService)
  notification = inject(NzNotificationService)

  onUpload() {
    const uploadInput = document.getElementById('upload')
    uploadInput?.click()
  }

  onSave() { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.type != FileTypes.SVG) {
        this.fileTypeWarnNotification()
        return
      }
      this.svgApi.uploadSvg(file).subscribe();
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
