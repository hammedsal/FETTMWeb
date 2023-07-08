import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private accessToken: string | undefined;
  private selectedClientId: number | undefined;
  private selectedTrackIds: string | undefined;
  private selectedTagIds: string | undefined;

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  setSelectedClient(clientId: number) {
    this.selectedClientId = clientId;
  }

  getSelectedClient(): number | undefined {
    return this.selectedClientId;
  }

  setSelectedTracks(trackIds: number[]) {
    this.selectedTrackIds = trackIds.join(",");
  }

  getSelectedTracks(): string | undefined {
    return this.selectedTrackIds;
  }

  setSelectedTags(tagIds: number[]) {
    this.selectedTagIds = tagIds.join(",");
  }

  getSelectedTags(): string | undefined {
    return this.selectedTagIds;
  }


  vKey(i: number, v: number): string {
    return '' + `${typeof v}-${v}`;
  }

  isNumberNotEmpty(value: number | undefined | null): boolean {
    return value !== undefined && value !== null && value > 0;
  }

  isStringNotEmpty(value: string | undefined | null): boolean {
    return value !== undefined && value !== null && value.trim() !== '';
  }

  compareArrays(arr1: number[], arr2: number[]): boolean {

    if (arr1.length !== arr2.length) return false;

    const d1: { [key: string]: boolean } = {};
    const d2: { [key: string]: boolean } = {};

    for (let i = arr1.length - 1; i >= 0; i--) {
      d1[this.vKey(i, arr1[i])] = true;
      d2[this.vKey(i, arr2[i])] = true;
    }

    for (let i = arr1.length - 1; i >= 0; i--) {
      const v = this.vKey(i, arr1[i]);
      if (d1[v] !== d2[v]) return false;
    }

    for (let i = arr2.length - 1; i >= 0; i--) {
      const v = this.vKey(i, arr2[i]);
      if (d1[v] !== d2[v]) return false;
    }

    return true;
  }
}
