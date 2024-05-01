import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAddClaimDialogComponent } from './client-add-claim-dialog.component';

describe('ClientAddClaimDialogComponent', () => {
  let component: ClientAddClaimDialogComponent;
  let fixture: ComponentFixture<ClientAddClaimDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAddClaimDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAddClaimDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
