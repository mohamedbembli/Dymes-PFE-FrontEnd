import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddAttributeComponent } from './dialog-add-attribute.component';

describe('DialogAddAttributeComponent', () => {
  let component: DialogAddAttributeComponent;
  let fixture: ComponentFixture<DialogAddAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
