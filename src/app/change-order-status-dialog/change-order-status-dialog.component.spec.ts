import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOrderStatusDialogComponent } from './change-order-status-dialog.component';

describe('ChangeOrderStatusDialogComponent', () => {
  let component: ChangeOrderStatusDialogComponent;
  let fixture: ComponentFixture<ChangeOrderStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeOrderStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOrderStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
