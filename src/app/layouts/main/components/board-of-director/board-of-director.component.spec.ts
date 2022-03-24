import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardOfDirectorComponent } from './board-of-director.component';

describe('BoardOfDirectorComponent', () => {
  let component: BoardOfDirectorComponent;
  let fixture: ComponentFixture<BoardOfDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardOfDirectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardOfDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
