import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { SVGItem } from "../interfaces/svg.interface";

export enum SVG_ACTION {
    SAVE = 'SAVE',
    UPLOAD = 'UPLOAD'
}

@Injectable({
    providedIn: 'root'
})
export class EditorFacade {
    private _selectedSvg$ = new BehaviorSubject<SVGItem | undefined>(undefined)
    public get getSelectedSvg(): SVGItem | undefined { return this._selectedSvg$.getValue() }
    public selectedSvgAsObs(): Observable<SVGItem | undefined> { return this._selectedSvg$.asObservable() }
    public set setSelectedSvg(svg: SVGItem) { this._selectedSvg$.next(svg) }

    private _svgActionTrigger$ = new BehaviorSubject<{ type: SVG_ACTION } | null>(null);
    public trigAction(type: SVG_ACTION) {
        this._svgActionTrigger$.next({ type })
    }
    public svgActionTrigger(): Observable<{ type: SVG_ACTION } | null> { return this._svgActionTrigger$.asObservable() }
}