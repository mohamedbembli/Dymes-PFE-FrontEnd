import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRatingDialogComponent } from './add-rating-dialog.component';

describe('AddRatingDialogComponent', () => {
  let component: AddRatingDialogComponent;
  let fixture: ComponentFixture<AddRatingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRatingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
