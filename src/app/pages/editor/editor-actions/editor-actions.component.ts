import { Component } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-editor-actions',
  imports: [NzCollapseModule],
  templateUrl: './editor-actions.component.html',
  styleUrl: './editor-actions.component.scss'
})
export class EditorActionsComponent {
  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 2'
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 3'
    }
  ];
}
