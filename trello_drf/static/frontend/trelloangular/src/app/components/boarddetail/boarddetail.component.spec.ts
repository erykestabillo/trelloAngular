import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoarddetailComponent } from './boarddetail.component';

describe('BoarddetailComponent', () => {
  let component: BoarddetailComponent;
  let fixture: ComponentFixture<BoarddetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoarddetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoarddetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
