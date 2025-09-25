import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SVGItem } from '../interfaces/svg.interface';

@Injectable({
    providedIn: 'root'
})
export class EditorApiService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/svg';

    uploadSvg(file: File): Observable<SVGItem> {
        return new Observable(observer => {
            const reader = new FileReader();
            reader.onload = async () => {
                const text = await file.text()
                const svgContent = reader.result as string;
                const svgItem: SVGItem = {
                    name: file.name,
                    content: svgContent,
                    text
                };
                this.http.post<SVGItem>(this.apiUrl, svgItem).subscribe({
                    next: res => observer.next(res),
                    error: err => observer.error(err),
                    complete: () => observer.complete()
                });
            };
            reader.onerror = err => observer.error(err);
            reader.readAsText(file);
        });
    }

    getSvgs(): Observable<SVGItem[]> {
        return this.http.get<SVGItem[]>(this.apiUrl);
    }

    getSvg(id: number): Observable<SVGItem> {
        return this.http.get<SVGItem>(`${this.apiUrl}/${id}`);
    }

    updateSvg(svgItem: SVGItem): Observable<SVGItem> {
        if (!svgItem.id) throw new Error('SVG id is required for update');
        return this.http.put<SVGItem>(`${this.apiUrl}/${svgItem.id}`, svgItem);
    }

    deleteSvg(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
