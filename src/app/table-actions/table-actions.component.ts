import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalService } from '../global.service';
import { TTMPriceDisplayedColumnKeys } from '../UserDefinedTypes/ttmprice-dto';

@Component({
  selector: 'app-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.css'],
})
export class TableActionsComponent implements OnInit {
  showZeroProces: boolean = false;
  selectedSortingColumn: string = ''; // Store the selected column for sorting
  selectedSortingOrder: string = 'ASC'; // Store the sorting order ('ASC' or 'DESC')
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

  onApply() {
    // Create an actions object containing the selected options and emit it to the parent component
    const actions = {
      showZeroProces: this.showZeroProces,
      selectedSortingColumn: this.selectedSortingColumn,
      selectedSortingOrder: this.selectedSortingOrder,
      priceIncAmount: this.priceIncAmount,
      priceIncPercent: this.priceIncPercent,
    };
    this.applyActions.emit(actions);
  }
}
