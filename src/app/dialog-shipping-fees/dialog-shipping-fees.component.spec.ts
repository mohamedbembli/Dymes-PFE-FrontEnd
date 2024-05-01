import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShippingFeesComponent } from './dialog-shipping-fees.component';

describe('DialogShippingFeesComponent', () => {
  let component: DialogShippingFeesComponent;
  let fixture: ComponentFixture<DialogShippingFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogShippingFeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogShippingFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
