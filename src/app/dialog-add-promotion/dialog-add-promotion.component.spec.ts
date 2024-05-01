import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPromotionComponent } from './dialog-add-promotion.component';

describe('DialogAddPromotionComponent', () => {
  let component: DialogAddPromotionComponent;
  let fixture: ComponentFixture<DialogAddPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddPromotionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
