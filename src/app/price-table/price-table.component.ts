import { Component, ViewChildren, OnInit, QueryList, ElementRef, Input, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { TTMPriceDto, TTMPriceColumns } from '../UserDefinedTypes/ttmprice-dto';


@Component({
  selector: 'custom-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.css']
})
export class PriceTableComponent {

  @Input() pricesList: TTMPriceDto[] = [];
  @ViewChild(MatTable) matTable!: MatTable<TTMPriceDto>;
  @ViewChildren(MatInput,{read:ElementRef}) inputs!: QueryList<ElementRef>;
  
  editRowId:number=2;
  displayedColumns: string[] = ['track', 'tag', 'section', 'plan', 'price', 'newprice', 'date' ]; //TTMPriceColumns.map((col) => col.key);
  displayedTitles: any = {'id':'מזהה', 'price':'מחיר', 'newprice':'מחיר מעודכן', 'tag':'שם תמחיר', 'track':'שם מסלול', 'section':'סוג מחיר', 'plan':'שיטת חישוב', 'date':'עדכון אחרון' };

  columnsSchema: any = TTMPriceColumns;
  valid: any = {}

  // Datasource for table
  dataSource: MatTableDataSource<TTMPriceDto> =
    new MatTableDataSource<TTMPriceDto>();

 // constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    let tableData: Array<TTMPriceDto> = [];
    this.dataSource = new MatTableDataSource<TTMPriceDto>(tableData);

    console.log('No Prices to display !');
  }

  editPrice(priceId: number)
  {
    this.editRowId = priceId;
    setTimeout(()=>{
      const newPriceElem = this.inputs.find( elm => elm.nativeElement.getAttribute('name') === 'newprice' );
      newPriceElem?.nativeElement.focus();
    })
  }

  // editRow(row: TTMPriceDto) {
  //   //this.userService.updateUser(row).subscribe(() => (row.isEdit = false))
  // }

  // inputHandler(e: any, id: number, key: string) {
  //   if (!this.valid[id]) {
  //     this.valid[id] = {}
  //   }
  //   this.valid[id][key] = e.target.validity.valid
  // }

  // disableSubmit(id: number) {
  //   if (this.valid[id]) {
  //     return Object.values(this.valid[id]).some((item) => item === false)
  //   }
  //   return false
  // }

  // isAllSelected() {
  //   //return this.dataSource.data.every((item) => item.isSelected)
  // }

  // isAnySelected() {
  //   //return this.dataSource.data.some((item) => item.isSelected)
  // }

  // selectAll(event: any) {
  //   // this.dataSource.data = this.dataSource.data.map((item) => ({
  //   //   ...item,
  //   //   isSelected: event.checked,
  //   // }))
  // }
}

