import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastCheckoutDialogComponent } from './fast-checkout-dialog.component';

describe('FastCheckoutDialogComponent', () => {
  let component: FastCheckoutDialogComponent;
  let fixture: ComponentFixture<FastCheckoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastCheckoutDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastCheckoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
