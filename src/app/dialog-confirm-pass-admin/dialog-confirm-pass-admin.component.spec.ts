import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmPassAdminComponent } from './dialog-confirm-pass-admin.component';

describe('DialogConfirmPassAdminComponent', () => {
  let component: DialogConfirmPassAdminComponent;
  let fixture: ComponentFixture<DialogConfirmPassAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmPassAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmPassAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
