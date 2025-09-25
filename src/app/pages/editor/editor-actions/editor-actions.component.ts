import { Component, inject } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { EditorFacade } from '../shared/facade/editor.facade';

@Component({
  selector: 'app-editor-actions',
  imports: [NzCollapseModule],
  templateUrl: './editor-actions.component.html',
  styleUrl: './editor-actions.component.scss'
})
export class EditorActionsComponent {

  editorFacade = inject(EditorFacade)

  panels = [
    {
      active: false,
      disabled: false,
      name: 'Action',
    },
    {
      active: false,
      disabled: false,
      name: 'Content'
    },
    {
      active: false,
      disabled: false,
      name: 'View'
    },
    {
      active: false,
      disabled: false,
      name: 'Animation'
    }
  ];
}
