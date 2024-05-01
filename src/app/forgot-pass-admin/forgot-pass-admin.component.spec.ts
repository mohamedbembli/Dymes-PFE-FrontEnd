import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassAdminComponent } from './forgot-pass-admin.component';

describe('ForgotPassAdminComponent', () => {
  let component: ForgotPassAdminComponent;
  let fixture: ComponentFixture<ForgotPassAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPassAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPassAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
