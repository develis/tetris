
import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'gamepad-component',
    template: 
       `<h4>Dificuldade</h4>
        <select class="form-control" [attr.disabled]="disabled" [(ngModel)]="selectedDifficulty" (ngModelChange)="onChange($event)">
           <option *ngFor="let c of difficulties" value="{{c.id}}">{{c.name}}</option>
        </select>`
     })
 export class GamePadComponent implements OnInit{
    ngOnInit(): void {
    }
 }