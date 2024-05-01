import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsellComponent } from './upsell.component';

describe('UpsellComponent', () => {
  let component: UpsellComponent;
  let fixture: ComponentFixture<UpsellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
