import { Component } from "@angular/core";
import { EditorModifyComponent } from "./editor-modify/editor-modify.component";
import { EditorActionsComponent } from "./editor-actions/editor-actions.component";
import { EditorHeaderComponent } from "./editor-header/editor-header.component";
import { EditorListComponent } from "./editor-list/editor-list.component";

@Component({
    templateUrl: './editor.component.html',
    imports: [
        EditorModifyComponent,
        EditorActionsComponent,
        EditorHeaderComponent,
        EditorListComponent
    ]
})
export class EditorComponent { }
