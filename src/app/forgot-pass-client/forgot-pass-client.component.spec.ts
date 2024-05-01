import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassClientComponent } from './forgot-pass-client.component';

describe('ForgotPassClientComponent', () => {
  let component: ForgotPassClientComponent;
  let fixture: ComponentFixture<ForgotPassClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPassClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPassClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
