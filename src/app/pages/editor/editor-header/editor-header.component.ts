import { Component, inject } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditorApiService } from '../shared/api/editor-api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EditorFacade } from '../shared/facade/editor.facade';

@Component({
  selector: 'app-editor-header',
  imports: [NzIconModule,],
  templateUrl: './editor-header.component.html',
  styleUrl: './editor-header.component.scss'
})
export class EditorHeaderComponent {
  editorFacade = inject(EditorFacade)
  editorApi = inject(EditorApiService)
  notification = inject(NzNotificationService)

  public onUpload() {
    const uploadInput = document.getElementById('upload')
    uploadInput?.click()
  }

  public onSave() {
    this.editorFacade.trigSave()
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const svgFile = input.files[0];
      this.editorApi.uploadSvg(svgFile).subscribe((res) => {
        if (!res) return
        this.notification
          .success(
            'Successful Upload!',
            ''
          )
        window.dispatchEvent(new Event('newUpload'))
      });
    }
  }
}
