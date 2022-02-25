import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningDesignComponent } from './learning-design.component';

describe('LearningDesignComponent', () => {
  let component: LearningDesignComponent;
  let fixture: ComponentFixture<LearningDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
