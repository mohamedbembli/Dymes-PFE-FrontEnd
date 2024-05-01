import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryShopComponent } from './category-shop.component';

describe('CategoryShopComponent', () => {
  let component: CategoryShopComponent;
  let fixture: ComponentFixture<CategoryShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
