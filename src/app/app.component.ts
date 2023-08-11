import { Component, ViewChild } from '@angular/core';
import { environment } from './../environments/environment';
import { GlobalService } from './global.service';
import { CustomSelectionList } from './mat-selection-list/mat-selection-list.component';
import { PriceTableComponent } from './price-table/price-table.component';

import { MatTableDataSource } from '@angular/material/table'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directionality } from '@angular/cdk/bidi';

import { TTMTrackDto } from './UserDefinedTypes/ttmtrack-dto';
import { TTMClientDto } from './UserDefinedTypes/ttmclient-dto';
import { TTMTagDto } from './UserDefinedTypes/ttmtag-dto';
import { TTMPriceDto } from './UserDefinedTypes/ttmprice-dto';
import { TableActionsDto } from './UserDefinedTypes/table-actions-dto';


const API_KEY = "e8067b53"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('clientsSelectionList') clientsSelectionList!: CustomSelectionList;
  @ViewChild('tagsSelectionList') tagsSelectionList!: CustomSelectionList;
  @ViewChild('tracksSelectionList') tracksSelectionList!: CustomSelectionList;
  @ViewChild('pricesTable') pricesTable!: PriceTableComponent;

  BASE_HOST_URL: string = environment.apiUrl; //'https://dev45api.ttmweb.net';

  tagProp: any = {
    id: 'tagId', name: 'tagName',
    singleSelection: false,
    displayItemTitle: 'תמחיר',
    displayListTitle: 'תמחירים'
  };

  clientProp: any = {
    id: 'entityId', name: 'entityName',
    singleSelection: true,
    displayItemTitle: 'לקוח',
    displayListTitle: 'לקוחות'
  };

  trackProp: any = {
    id: 'id', name: 'name',
    singleSelection: false,
    displayItemTitle: 'מסלול',
    displayListTitle: 'מסלולים'
  };

  priceProp: any = {
    id: 'id', name: 'price',
    singleSelection: false,
    displayItemTitle: 'מחיר',
    displayListTitle: 'מחירים'
  };

  currentActions: TableActionsDto = new TableActionsDto();
  tagsFullList: TTMTagDto[] = [];
  clientsFullList: TTMClientDto[] = [];
  tracksFullList: TTMTrackDto[] = [];
  pricesFullList: TTMPriceDto[] = [];

  tagIdsFullList: number[] = [];
  trackIdsFullList: number[] = [];
  ALL_ITEMS: number[] = [-1];

  accessToken: string = '';
  companyName: string = '';
  expiresIn: number = 0;
  userName: string = '';
  roleName: string = '';

  title = 'TTMWeb - Prices Editor';
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  showTableActions = false;

  constructor(
    //private route: ActivatedRoute,
    //private dir: Directionality, 
    private http: HttpClient,
    private globalService: GlobalService) {

  }


  displayWith(value: any) {
    return value?.Title;
  }

  clearSelection() {
  }

  ngOnInit() {
    // console.log('Calling ngOnInit()');

    console.log('Environment: ' + JSON.stringify(environment));

    this.accessToken = sessionStorage.getItem('API_ACCESS_TOKEN') || '';
    this.companyName = sessionStorage.getItem('API_COMPANY_NAME') || 'TTM - A BMS PRODUCT';
    this.companyName = decodeURIComponent(this.companyName);

    if (!!this.accessToken) {
      this.preLoadData(this.accessToken);
    }

  }

  showHideTableActions() {
    this.showTableActions = !this.showTableActions;
  }

  goBack() {
    window.history.back();
  }

  onClientSelected(selectedClients: TTMClientDto[]) {
    if (!!selectedClients && !!selectedClients[0]) {
      // console.log(selectedClients);
      const clientId = selectedClients[0].entityId;
      this.globalService.setSelectedClient(clientId);
      // console.log('selectedClients= ' + clientId);

      this.getClientTracks(clientId);

      let tableData: Array<TTMPriceDto> = [];
      this.pricesTable.dataSource = new MatTableDataSource<TTMPriceDto>(tableData);

    }
  }

  onTrackSelected(selectedTracks: TTMTrackDto[]) {
    if (selectedTracks?.length > 0) {
      const trackIdList = selectedTracks.map(item => item.id);
      if (this.globalService.compareArrays(this.trackIdsFullList, trackIdList)) {
        this.globalService.setSelectedTracks(this.ALL_ITEMS);
      } else {
        this.globalService.setSelectedTracks(trackIdList);
      }
    } else {
      this.globalService.setSelectedTracks([]);
      // console.log('No selected tracks');
    }
  }

  onTagSelected(selectedTags: TTMTagDto[]) {
    if (selectedTags?.length > 0) {
      const tagIdList = selectedTags.map(item => item.tagId);
      if (this.globalService.compareArrays(this.tagIdsFullList, tagIdList)) {
        this.globalService.setSelectedTags(this.ALL_ITEMS);
      } else {
        this.globalService.setSelectedTags(tagIdList);
      }
    } else {
      this.globalService.setSelectedTags([]);
      // console.log('No selected tags');
    }
  }

  onApplyActions(actions: TableActionsDto) {
    // hold a copy of old actions to be used after re-fetch
    this.currentActions = actions;

    let filteredPrices = [...this.pricesFullList];

    console.log('actions.showZeroPrices = ' + actions.showZeroPrices);
    console.log('Boolean(actions.showZeroPrices)  = ' + Boolean(actions.showZeroPrices) );
    if (actions.showZeroPrices+'' !== 'true') {
      filteredPrices = filteredPrices.filter((price) => price.price !== 0);
      console.log(filteredPrices);
    }

    if (actions.selectedSortingColumn) {
      let column: string = actions.selectedSortingColumn;
      const order = actions.selectedSortingOrder === 'ASC' ? 1 : -1;

      switch (column) {
        case "track":
          filteredPrices = filteredPrices.sort((a, b) => ((a.track > b.track) ? 1 : -1) * order);
          break;
        case "tag":
          filteredPrices = filteredPrices.sort((a, b) => ((a.tag > b.tag) ? 1 : -1) * order);
          break;
        case "section":
          filteredPrices = filteredPrices.sort((a, b) => ((a.section > b.section) ? 1 : -1) * order);
          break;
        case "plan":
          filteredPrices = filteredPrices.sort((a, b) => ((a.plan > b.plan) ? 1 : -1) * order);
          break;
        case "price":
          filteredPrices = filteredPrices.sort((a, b) => (a.price - b.price) * order);
          break;
        case "newprice":
          filteredPrices = filteredPrices.sort((a, b) => ((a.newprice > b.newprice) ? 1 : -1) * order);
          break;
        case "date":
          filteredPrices = filteredPrices.sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()) * order);
          break;
        default:
          console.log("Unknown column.");
          break;
      }
    }

    if (actions.priceIncAmount !== 0) {
      filteredPrices.forEach((price) => (price.newprice = price.price == 0 ? 0 : price.price + actions.priceIncAmount));
    }

    if (actions.priceIncPercent !== 0) {
      const factor = 1 + actions.priceIncPercent / 100;
      filteredPrices.forEach((price) => (price.newprice = Number((price.price * factor).toFixed(2))));
    }

    // reset to prevent multiple action execution
    actions.priceIncAmount = 0;
    actions.priceIncPercent = 0;

    let tableData: Array<TTMPriceDto> = filteredPrices;
    this.pricesTable.dataSource = new MatTableDataSource<TTMPriceDto>(tableData);

  }

  getAccessToken() {

    // console.log('Calling getAccessToken()');
    //const url = this.BASE_HOST_URL + '/token';
    const url = this.BASE_HOST_URL + '/token';
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', 'ttm_admin2');
    body.set('password', '1q2w3e');

    this.http.post(url, body.toString(), { headers: headers }).subscribe(
      loginResponse => {
        const response: any = loginResponse;
        // this.accessToken = response.access_token;
        // this.expiresIn = response.expires_in;
        // this.userName = response.userName;
        // this.roleName = response.roleName;
        this.accessToken = response.access_token;

        // console.log('Access token reached from API:', response.access_token);

        this.preLoadData(response.access_token);
      },
      error => {
        console.error(error);
      }
    );
  }

  preLoadData(apiToken: string) {

    // console.log('preLoadData: ' + apiToken);

    // save in session
    this.globalService.setAccessToken(apiToken);

    this.getClients();
    this.getTags();

  }

  getClients() {
    const url = this.BASE_HOST_URL + '/api/ttmclients';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
      'cache-control': 'no-cache'
    });

    this.http.get(url, { headers: headers, responseType: 'json' }).subscribe(
      response => {
        // Process the response data as needed
        const apiResponse: any = response;
        this.clientsFullList = apiResponse.entities;

        if (this.clientsFullList != null && this.clientsFullList.length > 0) {
          this.companyName = this.clientsFullList[0].companyName;
          console.log(this.companyName);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  getTags() {
    const url = this.BASE_HOST_URL + '/api/ttmpricetags';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
      'cache-control': 'no-cache'
    });

    this.http.get(url, { headers: headers, responseType: 'json' }).subscribe(
      response => {
        // console.log(response);
        // Process the response data as needed
        const apiResponse: any = response;
        // console.log(apiResponse.entities);
        this.tagsFullList = apiResponse.entities;
        this.tagIdsFullList = this.tagsFullList.map(item => item.tagId);
      },
      error => {
        console.error(error);
      }
    );
  }

  getClientTracks(clientId: any) {
    const url = this.BASE_HOST_URL + '/api/ttmtracks/' + clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
      'cache-control': 'no-cache'
    });

    this.http.get(url, { headers: headers, responseType: 'json' }).subscribe(
      response => {
        // Process the response data as needed
        const apiResponse: any = response;
        this.tracksFullList = apiResponse.entities;
        this.trackIdsFullList = this.tracksFullList.map(item => item.id);
      },
      error => {
        console.error(error);
      }
    );
  }

  getPrices(clientId: number | undefined, trackIds: string | undefined, tagIds: string | undefined) {

    if (!this.globalService.isNumberNotEmpty(clientId) ||
      !this.globalService.isStringNotEmpty(tagIds) ||
      !this.globalService.isStringNotEmpty(trackIds)) {
      let tableData: Array<TTMPriceDto> = [];
      this.pricesTable.dataSource = new MatTableDataSource<TTMPriceDto>(tableData);

      // console.log('No Prices to display !');
      return;
    }

    const encTagIds = encodeURIComponent(!!tagIds ? tagIds : '');
    const encTrackIds = encodeURIComponent(!!trackIds ? trackIds : '');

    const url = this.BASE_HOST_URL + '/api/ttmprices?clientId=' + clientId + '&trackIds=' + encTrackIds + '&tagIds=' + encTagIds;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
      'cache-control': 'no-cache'
    });

    this.http.get(url, { headers: headers, responseType: 'json' }).subscribe(
      response => {
        // Process the response data as needed
        const apiResponse: any = response;
        this.pricesFullList = apiResponse.entities;

        // set newprice = price for all items
        this.pricesFullList.forEach(
          item => this.prepareListItem(item)
        );

        this.onApplyActions(this.currentActions);
        //let tableData: Array<TTMPriceDto> = this.pricesFullList;
        //this.pricesTable.dataSource = new MatTableDataSource<TTMPriceDto>(tableData);

      },
      error => {
        console.error(error);
      }
    );
  }

  prepareListItem(item: TTMPriceDto) {
    item.newprice = item.price;
    item.section = item.section === 'S1' ? 'לקוח' : 'קבלן';
    item.plan = item.plan === 'U' ? 'יחידה' : 'הובלה';
  }

  // Add a method to select all tags
  selectAllTags(): void {
    this.tagsSelectionList.selectAll();
  }
  // Add a method to select all tracks
  selectAllTracks(): void {
    this.tracksSelectionList.selectAll();
  }

  displayTrackPrices(): void {

    const clientId = this.globalService.getSelectedClient();
    const tagIds = this.globalService.getSelectedTags();
    const trackIds = this.globalService.getSelectedTracks();

    // console.log('ClientId= ' + clientId);
    // console.log('TagIds= ' + tagIds);
    // console.log('TrackIds= ' + trackIds);

    this.getPrices(clientId, trackIds, tagIds);

  }

  updateTrackPrices(): void {

    const clientId = this.globalService.getSelectedClient();
    // console.log('ClientId= ' + clientId);

    const url = this.BASE_HOST_URL + '/api/ttmprices/' + clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
      'cache-control': 'no-cache'
    });

    const priceChanges = this.pricesFullList
      .filter((price) => price.price !== price.newprice)
      .map(dto => ({ "id": dto.id, "price": dto.newprice }));
    // console.log('priceChanges= ' + JSON.stringify(priceChanges));

    let body = { "prices": priceChanges };

    this.http.put(url, body, { headers: headers, responseType: 'json' }).subscribe(
      response => {
        // Process the response data as needed
        const apiResponse: any = response;
        const updatedPricesList = apiResponse.entities;

        // set newprice = price for all items
        this.mergeUpdatedPrices(updatedPricesList);

        this.onApplyActions( this.currentActions);
        // let tableData: Array<TTMPriceDto> = this.pricesFullList;
        // this.pricesTable.dataSource = new MatTableDataSource<TTMPriceDto>(tableData);

      },
      error => {
        console.error(error);
      }
    );

  }

  mergeUpdatedPrices(updatedPrices: any[]) {

    for (const updPrice of updatedPrices) {

      const matchingPriceDto = this.pricesFullList.find(origPrice => origPrice.id === updPrice.id);
      if (matchingPriceDto) {
        matchingPriceDto.price = updPrice.price;
        matchingPriceDto.date = updPrice.date;
      }
    }

  }
}