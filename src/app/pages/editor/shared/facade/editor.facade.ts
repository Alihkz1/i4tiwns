import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { SVGItem } from "../interfaces/svg.interface";

@Injectable({
    providedIn: 'root'
})
export class EditorFacade {
    private _selectedSvg$ = new BehaviorSubject<SVGItem | undefined>(undefined)
    public get getSelectedSvg(): SVGItem | undefined { return this._selectedSvg$.getValue() }
    public selectedSvgAsObs(): Observable<SVGItem | undefined> { return this._selectedSvg$.asObservable() }
    public set setSelectedSvg(svg: SVGItem) { this._selectedSvg$.next(svg) }

    private _saveSvgTrigger$ = new Subject<void>();
    public trigSave() {
        if (!this.getSelectedSvg) return
        this._saveSvgTrigger$.next()
    }
    public saveSvgTrigger(): Observable<void> { return this._saveSvgTrigger$.asObservable() }
}