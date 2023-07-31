import { Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alertshow',
  templateUrl: './alertshow.component.html',
  styleUrls: ['./alertshow.component.scss'],
})
export class AlertshowComponent implements OnChanges {

  @Input() mensaje:any;
  @Input() visible:boolean;
  modal:string
  card: string = 'card'
  @Output() salida = new EventEmitter<boolean>();
 

  constructor() { }

  ngOnChanges(){
    if (this.visible) {
      this.modal = 'modal2'
    }else{
      this.modal = 'modal'
    }
  }

  dissmiss(){
    this.visible = false;
    this.salida.emit(this.visible);
    this.ngOnChanges();
  }

}
