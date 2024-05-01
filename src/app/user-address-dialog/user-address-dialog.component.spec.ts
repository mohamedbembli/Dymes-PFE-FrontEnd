import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddressDialogComponent } from './user-address-dialog.component';

describe('UserAddressDialogComponent', () => {
  let component: UserAddressDialogComponent;
  let fixture: ComponentFixture<UserAddressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAddressDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
