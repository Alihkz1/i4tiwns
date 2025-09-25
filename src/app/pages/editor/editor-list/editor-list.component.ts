import { Component, inject, OnInit } from '@angular/core';
import { SvgApiService } from '../shared/api/editor-api.service';
import { SVGItem } from '../shared/interfaces/svg.interface';
import { Subscription } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EncodedSvg } from '../shared/utilities/svg-to-image.utility';

@Component({
  selector: 'app-editor-list',
  imports: [NzSpinModule],
  templateUrl: './editor-list.component.html',
  styleUrl: './editor-list.component.scss'
})
export class EditorListComponent implements OnInit {
  svgApi = inject(SvgApiService)
  svgs: SVGItem[] = []
  pending: Subscription | undefined

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.pending = this.svgApi.getSvgs().subscribe((svgs: SVGItem[]) => {
      this.svgs = svgs.map((svg) => ({
        ...svg,
        img: EncodedSvg(svg.content)
      }))
      console.log(svgs)
    })
  }
}
