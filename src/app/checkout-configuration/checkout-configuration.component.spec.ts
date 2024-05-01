import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutConfigurationComponent } from './checkout-configuration.component';

describe('CheckoutConfigurationComponent', () => {
  let component: CheckoutConfigurationComponent;
  let fixture: ComponentFixture<CheckoutConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
