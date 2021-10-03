import { Component, OnInit } from "@angular/core";

@Component({
   selector: 'difficulty-component',
   template:
      `<h6>Dificuldade</h6>
        <select class="form-control-sm" [attr.disabled]="disabled" [(ngModel)]="selectedDifficulty" (ngModelChange)="onChange($event)">
           <option *ngFor="let c of difficulties" value="{{c.id}}">{{c.name}}</option>
        </select>`
})
export class DifficultyComponent implements OnInit {
   ngOnInit(): void {
      this.selectedDifficulty = 1;
   }
   difficulties = [
      { id: 1, name: "Fácil" },
      { id: 3, name: "Médio" },
      { id: 6, name: "Difícil" },
   ];
   selectedDifficulty: number = 1;
   disabled: string = null;

   onChange(newValue: any): void {
      console.log(newValue)
   }

   notifyGameStatus(status: boolean): void {
      if (status) {
         this.disabled = 'disabled';
      }
      else {
         this.disabled = null;
      }
   }

}