import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {MatSelectionList, MatListOption, MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'custom-selection-list',
  templateUrl: './mat-selection-list.component.html',
  styleUrls: ['./mat-selection-list.component.css']
})
export class CustomSelectionList {
  
  @Input() objectsList: any[] = [];
  @Input() controlProp: any = {};
  @Output() onItemSelected = new EventEmitter<any[]>();

  @ViewChild(MatSelectionList) matSelectionList!: MatSelectionList;
  
  selectedItems: any[] = [];

  onSelectionChange(event: MatSelectionListChange): void {
     this.onItemSelected.emit(this.selectedItems);
  }

  
  selectAll(){
    
    if(this.controlProp.singleSelection) {
      this.onItemSelected.emit(this.selectedItems);
    } else {
      this.matSelectionList.selectAll();
      this.onItemSelected.emit(this.selectedItems);
    }
  }

}
