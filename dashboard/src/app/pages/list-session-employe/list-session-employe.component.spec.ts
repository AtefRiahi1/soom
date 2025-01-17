import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSessionEmployeComponent } from './list-session-employe.component';

describe('ListSessionEmployeComponent', () => {
  let component: ListSessionEmployeComponent;
  let fixture: ComponentFixture<ListSessionEmployeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSessionEmployeComponent]
    });
    fixture = TestBed.createComponent(ListSessionEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
