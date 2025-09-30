import { Component, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { SVGItem } from '../shared/interfaces/svg.interface';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EncodedSvg } from '../shared/utilities/svg-to-image.utility';
import { EditorFacade, SVG_ACTION } from '../shared/facade/editor.facade';
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
  svgs: WritableSignal<SVGItem[]> = signal([])

  ngOnInit(): void {
    this.editorFacade.svgActionTrigger().subscribe(() => {
      this.getData()
    })
  }

  getData() {
    this.editorApi.getSvgs().subscribe((svgs: SVGItem[]) => {
      this.svgs.set(svgs.map((svg) => ({
        ...svg,
        img: EncodedSvg(svg.content)
      })))
    })
  }

  svg_onClick(svg: SVGItem) {
    this.editorFacade.setSelectedSvg = svg
  }
}
