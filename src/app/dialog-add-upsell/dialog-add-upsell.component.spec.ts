import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddUpsellComponent } from './dialog-add-upsell.component';

describe('DialogAddUpsellComponent', () => {
  let component: DialogAddUpsellComponent;
  let fixture: ComponentFixture<DialogAddUpsellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddUpsellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddUpsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
