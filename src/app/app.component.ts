import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directionality } from '@angular/cdk/bidi';
import { TTMTrackDto } from './UserDefinedTypes/ttmtrack-dto';
import { TTMClientDto } from './UserDefinedTypes/ttmclient-dto';
import { TTMTagDto } from './UserDefinedTypes/ttmtag-dto';
import { TTMPriceDto } from './UserDefinedTypes/ttmprice-dto';
import { CustomSelectionList } from './mat-selection-list/mat-selection-list.component';
import { PriceTableComponent } from './price-table/price-table.component';
import { MatTableDataSource } from '@angular/material/table'

import { GlobalService } from './global.service';

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

  //BASE_HOST_URL: string = 'http://dtm.ttmweb.net'; // PRODUCTION
  BASE_HOST_URL: string = 'https://dev45api.ttmweb.net'; // DEV45
  //BASE_HOST_URL: string = 'https://localhost:44310'; // LOCALHOST

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

  tagsFullList: TTMTagDto[] = [];
  clientsFullList: TTMClientDto[] = [];
  tracksFullList: TTMTrackDto[] = [];
  pricesFullList: TTMPriceDto[] = [];

  tagIdsFullList: number[] = [];
  trackIdsFullList: number[] = [];
  ALL_ITEMS: number[] = [-1];

  accessToken: string = '';
  expiresIn: number = 0;
  userName: string = '';
  roleName: string = '';

  title = 'TTMWeb - Prices Editor';
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;

  constructor(
    private route: ActivatedRoute,
    private dir: Directionality, 
    private http: HttpClient, 
    private globalService: GlobalService) { }

  displayWith(value: any) {
    return value?.Title;
  }

  clearSelection() {
  }

  ngOnInit() {
    console.log('Calling ngOnInit()');

    // Retrieve the access token from the query parameters
    this.route.queryParams.subscribe(params => {
      
      console.log('params = ' + JSON.stringify(params));
      
      let hasToken:boolean = false;
      if(params && Object.keys(params).includes('accessToken')) {
        const backendAccessToken = params['accessToken'];
        console.log('backendAccessToken = ' + backendAccessToken);

        // Check if accessToken parameter exists and is not empty
        if (backendAccessToken.length > 100) {
          console.log('ngOnInit:: Access token from Backend:', backendAccessToken);
          hasToken = true;
          this.preLoadData(backendAccessToken);
        } else {// if no token, call API to get a new one
          console.log('ngOnInit:: Trying getting token from API');
          this.getAccessToken();
        }
      }
    });
  }
  
  onClientSelected(selectedClients: TTMClientDto[]) {
    if (!!selectedClients && !!selectedClients[0]) {
      console.log(selectedClients);
      const clientId = selectedClients[0].entityId;
      this.globalService.setSelectedClient(clientId);
      console.log('selectedClients= ' + clientId);

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
      console.log('No selected tracks');
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
      console.log('No selected tags');
    }
  }

  getAccessToken() {
    
    console.log('Calling getAccessToken()');
    //const url = this.BASE_HOST_URL + '/token';
    const url = 'https://dev45api.ttmweb.net/token';
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
        console.log('Access token from Frontend:', response.access_token);

        this.preLoadData(response.access_token);
      },
      error => {
        console.error(error);
      }
    );
  }

  preLoadData(apiToken: string) {
    
    this.accessToken = apiToken;
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
        console.log(response);
        // Process the response data as needed
        const apiResponse: any = response;
        console.log(apiResponse.entities);
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

      console.log('No Prices to display !');
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

        let tableData: Array<TTMPriceDto> = this.pricesFullList;
        this.pricesTable.dataSource = new MatTableDataSource<TTMPriceDto>(tableData);

      },
      error => {
        console.error(error);
      }
    );
  }

  prepareListItem(item: TTMPriceDto) {
    item.newprice = item.price.toString();
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

    console.log('ClientId= ' + clientId);
    console.log('TagIds= ' + tagIds);
    console.log('TrackIds= ' + trackIds);

    this.getPrices(clientId, trackIds, tagIds);

  }

  updateTrackPrices(): void {

    const clientId = this.globalService.getSelectedClient();
    console.log('ClientId= ' + clientId);

    const url = this.BASE_HOST_URL + '/api/ttmprices/' + clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
      'cache-control': 'no-cache'
    });

    const priceChanges = this.pricesFullList
      .filter((price) => price.price !== parseFloat(price.newprice))
      .map(dto => ({ "id": dto.id, "price": dto.newprice }));
    console.log('priceChanges= ' + JSON.stringify(priceChanges));

    let body = { "prices": priceChanges };

    this.http.put(url, body, { headers: headers, responseType: 'json' }).subscribe(
      response => {
        // Process the response data as needed
        const apiResponse: any = response;
        const updatedPricesList = apiResponse.entities;

        // set newprice = price for all items
        this.mergeUpdatedPrices(updatedPricesList);

        let tableData: Array<TTMPriceDto> = this.pricesFullList;
        this.pricesTable.dataSource = new MatTableDataSource<TTMPriceDto>(tableData);

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