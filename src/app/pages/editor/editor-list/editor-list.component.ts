import { Component, inject, OnInit } from '@angular/core';
import { SVGItem } from '../shared/interfaces/svg.interface';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EncodedSvg } from '../shared/utilities/svg-to-image.utility';
import { EditorFacade } from '../shared/facade/editor.facade';
import { EditorApiService } from '../shared/api/editor-api.service';

@Component({
  selector: 'app-editor-list',
  imports: [NzSpinModule],
  templateUrl: './editor-list.component.html',
  styleUrl: './editor-list.component.scss'
})
export class EditorListComponent implements OnInit {
  editorApi = inject(EditorApiService)
  editorFacade = inject(EditorFacade)
  svgs: SVGItem[] = []

  ngOnInit(): void {
    this.getData()
    window.addEventListener("newUpload", () => {
      this.getData()
    })
  }

  getData() {
    // this.editorApi.deleteSvg("58a9").subscribe()
    this.editorApi.getSvgs().subscribe((svgs: SVGItem[]) => {
      this.svgs = svgs.map((svg) => ({
        ...svg,
        img: EncodedSvg(svg.content)
      }))
      console.log(svgs);
    })
  }

  svg_onClick(svg: SVGItem) {
    this.editorFacade.setSelectedSvg = svg
  }
}
