import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCheckerComponent } from './input-checker.component';

describe('InputCheckerComponent', () => {
  let component: InputCheckerComponent;
  let fixture: ComponentFixture<InputCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputCheckerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
