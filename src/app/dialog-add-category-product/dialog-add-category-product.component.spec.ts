import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddCategoryProductComponent } from './dialog-add-category-product.component';

describe('DialogAddCategoryProductComponent', () => {
  let component: DialogAddCategoryProductComponent;
  let fixture: ComponentFixture<DialogAddCategoryProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddCategoryProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddCategoryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
