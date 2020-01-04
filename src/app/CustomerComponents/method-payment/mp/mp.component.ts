import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MethodPayment } from '../../../Share/Model/MethodPayment';
import { Action } from '../../../Share/Model/Action';
import { displayDateHebrow } from 'src/app/Share/Functions/DisplayDate';

@Component({
  selector: 'app-mp',
  templateUrl: './mp.component.html',
  styleUrls: ['./mp.component.css']
})
export class MpComponent implements OnInit {

  @Input() methodPayment: MethodPayment;
  @Input() mpActions: Action[];
  @Input() index: number;
  @Input() allOtherMpName:string[];
  @Output() updateMp = new EventEmitter<MethodPayment>(true);
  @Output() deleteMp = new EventEmitter<number>(true);
  @Output() moveExpense = new EventEmitter<void>(false);
  @Output() moveIncome = new EventEmitter<void>(false);
  @Output() moveActions = new EventEmitter<void>(false);
  showEdit:boolean = false;
  displayDateHebrow:Function = displayDateHebrow;


  update:boolean = false;
  mpForUpdate:MethodPayment;
  mpNameForUpdateIsValid:boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  getTopThreeAction(): Action[] {
    let actions: Action[] = this.mpActions;
    actions.sort((a, b) => {
      return b.id - a.id;
    })
    actions = actions.slice(0, 3);
    return actions;
  }

  displayRtl(): boolean {
    if (this.index % 2 == 0) {
      return true;
    } else {
      return false;
    }
  }

  startUpdate(){
    this.mpForUpdate = new MethodPayment();
    this.mpForUpdate.id = this.methodPayment.id;
    this.mpForUpdate.name = this.methodPayment.name;
    this.mpForUpdate.active = this.methodPayment.active;
    this.mpForUpdate.debitDate = this.methodPayment.debitDate
    this.update = true;
  }

  checkNameNotExists(mpName:string){
    this.mpNameForUpdateIsValid = true;
    this.allOtherMpName.forEach(name=>{
      if(name.toLowerCase() == mpName.toLowerCase()){
        this.mpNameForUpdateIsValid = false;
      }
    })

  }

  onUpdateMp() {
    this.updateMp.emit(this.mpForUpdate);
  }


  updateActive(){
    this.mpForUpdate = new MethodPayment();
    this.mpForUpdate.id = this.methodPayment.id;
    this.mpForUpdate.name = this.methodPayment.name;
    this.mpForUpdate.active = !this.methodPayment.active;
    this.mpForUpdate.debitDate = this.methodPayment.debitDate
    this.onUpdateMp();
  }

  onDeleteMp() {
    this.deleteMp.emit(this.methodPayment.id);
  }

  onMoveIncome(){
    this.moveIncome.emit();
  }

  onMoveExpense(){
    this.moveExpense.emit();
  }

  onMoveActions(){
    this.moveActions.emit();
  }

  

}
