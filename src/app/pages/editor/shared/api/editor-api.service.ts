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

    public uploadSvg(file: File): Observable<SVGItem> {
        return new Observable(observer => {
            const reader = new FileReader();
            reader.onload = async () => {
                const svgContent = reader.result as string;
                const svgItem: SVGItem = {
                    name: file.name,
                    content: svgContent,
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

    public getSvgs(): Observable<SVGItem[]> {
        return this.http.get<SVGItem[]>(this.apiUrl);
    }

    public getSvg(id: number): Observable<SVGItem> {
        return this.http.get<SVGItem>(`${this.apiUrl}/${id}`);
    }

    public updateSvg(svgItem: SVGItem): Observable<SVGItem> {
        if (!svgItem.id) throw new Error('SVG id is required for update');
        return this.http.put<SVGItem>(`${this.apiUrl}/${svgItem.id}`, svgItem);
    }

    public deleteSvg(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
