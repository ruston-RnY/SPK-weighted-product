import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWarningComponent } from './dialog-warning.component';

describe('DialogWarningComponent', () => {
  let component: DialogWarningComponent;
  let fixture: ComponentFixture<DialogWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
