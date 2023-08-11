import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalService } from '../global.service';
import { TTMPriceDisplayedColumnKeys } from '../UserDefinedTypes/ttmprice-dto';
import { TableActionsDto } from '../UserDefinedTypes/table-actions-dto';

@Component({
  selector: 'app-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.css'],
})
export class TableActionsComponent implements OnInit {
  showZeroPrices: boolean = true;
  showZeroTitleOFF: string = 'לא כולל אפסים';
  showZeroTitleON: string = 'הכל כולל אפסים';

  selectedSortingOrder: string = 'ASC'; // Store the sorting order ('ASC' or 'DESC')
  sortingOrderTitleASC: string = 'עולה';
  sortingOrderTitleDESC: string = 'יורד';

  selectedSortingColumn: string = 'track'; // Store the selected column for sorting
  priceIncAmount: number = 0; // Amount to increase the prices
  priceIncPercent: number = 0; // Percentage to increase the prices

  @Output() applyActions: EventEmitter<any> = new EventEmitter<any>();

  displayedColumnKeys: string[] = TTMPriceDisplayedColumnKeys;
  displayedColumnTitles: any = this.globalService.getColumnTitles();


  constructor(private globalService: GlobalService) {}

  ngOnInit() {
    // Initialize the input fields if needed
    this.priceIncAmount = 0;
    this.priceIncPercent = 0;

  }

  changeZeroPricesGroup(showZeroPrices: boolean) {
    this.showZeroPrices = showZeroPrices;
  }

  changeSortingOrderGroup(selectedSortingOrder: string) {
    this.selectedSortingOrder = selectedSortingOrder;
  }

  onApply() {
    // Create an actions object containing the selected options and emit it to the parent component
    let actions: TableActionsDto = {
      showZeroPrices: this.showZeroPrices, // boolean
      selectedSortingColumn: this.selectedSortingColumn,
      selectedSortingOrder: this.selectedSortingOrder,
      priceIncAmount: this.priceIncAmount, // number
      priceIncPercent: this.priceIncPercent, // number
    };

    // reset these numbers to prevent multiple actions on same data
    this.priceIncAmount = 0;
    this.priceIncPercent = 0;

    this.applyActions.emit(actions);
  }
}
