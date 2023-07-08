import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectionList } from './mat-selection-list.component';

describe('CustomSelectionList', () => {
  let component: CustomSelectionList;
  let fixture: ComponentFixture<CustomSelectionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSelectionList ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSelectionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
