import { Component, HostListener, signal, ElementRef, viewChild, AfterViewInit, inject } from '@angular/core';
import { EditorFacade } from '../shared/facade/editor.facade';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorApiService } from '../shared/api/editor-api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface TextLabel {
  id: string;
  x: number;
  y: number;
  text: string;
  isEditing: boolean;
}

@Component({
  selector: 'app-editor-modify',
  templateUrl: './editor-modify.component.html',
  styleUrls: ['./editor-modify.component.scss']
})
export class EditorModifyComponent implements AfterViewInit {
  private svgContainer = viewChild<ElementRef<HTMLDivElement>>('svgContainer');
  private svgCanvas = viewChild<ElementRef<SVGSVGElement>>('svgCanvas');
  textLabels = signal<TextLabel[]>([]);
  showContextMenu = signal(false);
  contextMenuPosition = signal({ x: 0, y: 0 });
  svgContent = signal<SafeHtml>('');
  isLoading = signal(false);
  svgDimensions = signal({ width: 800, height: 600 });
  containerRect = signal({ left: 0, top: 0, width: 0, height: 0 });
  private _nextLabelId = 1;

  private editorApi = inject(EditorApiService)
  private sanitizer = inject(DomSanitizer);
  private editorFacade = inject(EditorFacade)
  notification = inject(NzNotificationService)

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateContainerRect();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showContextMenu() && !this.isContextMenuEvent(event)) {
      this.hideContextMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.hideContextMenu();
  }

  ngAfterViewInit(): void {
    this.editorFacade.saveSvgTrigger().subscribe(() => {
      this.onSave()
    })
    this.updateContainerRect();
    this.editorFacade.selectedSvgAsObs().subscribe((svg) => {
      if (!svg) return;
      this.loadSVGFromFile(svg.content)
    })
  }

  async loadSVGFromFile(svgFile: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgFile, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        console.error('Invalid SVG: no <svg> root element');
        return;
      }

      const inner = svgElement.innerHTML;
      this.svgContent.set(this.sanitizer.bypassSecurityTrustHtml(inner));

      this.textLabels.set([]);
      this.extractSVGDimensions(svgFile);
      this.updateContainerRect();
    } catch (error) {
      console.error('Error loading SVG:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private onSave(): void {
    const svgString = this.exportSVGWithLabels();

    const updatedItem = {
      ...this.editorFacade.getSelectedSvg!,
      content: svgString,
    };

    this.editorApi.updateSvg(updatedItem).subscribe((res) => {
      if (!res) return;
      this.notification
        .success(
          'SVG Saved!',
          ''
        )
    });
  }

  exportSVGWithLabels(): string {
    const svgElement = this.svgCanvas()?.nativeElement;
    if (!svgElement) return '';

    const clone = svgElement.cloneNode(true) as SVGSVGElement;

    const foreignObjects = clone.querySelectorAll('foreignObject');

    foreignObjects.forEach(fo => fo.remove());

    this.textLabels().forEach(label => {
      if (!label.isEditing) {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', label.x.toString());
        textElement.setAttribute('y', label.y.toString());
        // textElement.setAttribute('class', 'exported-label');
        // textElement.textContent = label.text;
        clone.appendChild(textElement);
      }
    });

    return new XMLSerializer().serializeToString(clone);
  }

  public updateContainerRect(): void {
    const container = this.svgContainer()?.nativeElement;
    if (!container) return
    const rect = container.getBoundingClientRect();
    this.containerRect.set({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });
  }

  private extractSVGDimensions(svgText: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (svgElement) {
      const width = parseInt(svgElement.getAttribute('width') || '800');
      const height = parseInt(svgElement.getAttribute('height') || '600');
      const viewBox = svgElement.getAttribute('viewBox');

      if (viewBox) {
        const viewBoxParts = viewBox.split(' ').map(Number);
        if (viewBoxParts.length === 4) {
          this.svgDimensions.set({ width: viewBoxParts[2], height: viewBoxParts[3] });
          return;
        }
      }

      this.svgDimensions.set({ width, height });
    }
  }

  public onRightClick(event: MouseEvent): void {
    event.preventDefault();

    const svgElement = this.svgCanvas()?.nativeElement;
    if (!svgElement || !this.svgContent()) return;

    const containerRect = this.containerRect();
    const relativeX = event.clientX - containerRect.left;
    const relativeY = event.clientY - containerRect.top;

    const menuWidth = 150;
    const menuHeight = 80;
    const adjustedX = relativeX + menuWidth > containerRect.width
      ? event.clientX - menuWidth
      : event.clientX;
    const adjustedY = relativeY + menuHeight > containerRect.height
      ? event.clientY - menuHeight
      : event.clientY;

    this.contextMenuPosition.set({
      x: adjustedX,
      y: adjustedY
    });

    const point = this.createSVGPoint(svgElement, event.clientX, event.clientY);
    const ctm = svgElement.getScreenCTM();

    if (!ctm) return;

    const invertedCTM = ctm.inverse();
    const svgPoint = point.matrixTransform(invertedCTM);

    this.currentClickPosition = {
      x: Math.max(0, Math.min(svgPoint.x, this.svgDimensions().width)),
      y: Math.max(0, Math.min(svgPoint.y, this.svgDimensions().height))
    };

    this.showContextMenu.set(true);
  }

  private createSVGPoint(svgElement: SVGSVGElement, x: number, y: number): DOMPoint {
    if (svgElement.createSVGPoint) {
      const point = svgElement.createSVGPoint();
      point.x = x;
      point.y = y;
      return point;
    }
    return new DOMPoint(x, y);
  }

  public onSvgClick(event: MouseEvent): void {
    if (this.showContextMenu() && event.button === 0) {
      this.hideContextMenu();
    }
  }

  // editing

  startEditing(labelId: string): void {
    this.textLabels.update(labels =>
      labels.map(label =>
        label.id === labelId ? { ...label, isEditing: true } : label
      )
    );

    setTimeout(() => {
      this.focusTextInput(labelId);
    }, 10);
  }

  finishEditing(labelId: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newText = inputElement.value.trim();

    this.textLabels.update(labels =>
      labels.map(label =>
        label.id === labelId
          ? { ...label, text: newText || 'New Label', isEditing: false }
          : label
      )
    );
  }

  cancelEditing(labelId: string): void {
    this.textLabels.update(labels =>
      labels.map(label =>
        label.id === labelId
          ? { ...label, isEditing: false }
          : label
      )
    );
  }

  // label

  removeLabel(labelId: string): void {
    this.textLabels.update(labels => labels.filter(label => label.id !== labelId));
  }

  private currentClickPosition = { x: 0, y: 0 };

  addTextLabel(): void {
    const newLabel: TextLabel = {
      id: `label-${this._nextLabelId++}`,
      x: this.currentClickPosition.x,
      y: this.currentClickPosition.y,
      text: 'New Label',
      isEditing: true
    };

    this.textLabels.update(labels => [...labels, newLabel]);
    this.hideContextMenu();

    setTimeout(() => {
      this.focusTextInput(newLabel.id);
    }, 10);
  }


  //context menu

  private isContextMenuEvent(event: MouseEvent): boolean {
    return (event.target as HTMLElement).closest('.context-menu') !== null;
  }

  hideContextMenu(): void {
    this.showContextMenu.set(false);
  }

  private focusTextInput(labelId: string): void {
    const inputElement = document.querySelector(`[data-label-id="${labelId}"]`) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
      inputElement.select();
    }
  }
}