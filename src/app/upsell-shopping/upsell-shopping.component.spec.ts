import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsellShoppingComponent } from './upsell-shopping.component';

describe('UpsellShoppingComponent', () => {
  let component: UpsellShoppingComponent;
  let fixture: ComponentFixture<UpsellShoppingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsellShoppingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsellShoppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
