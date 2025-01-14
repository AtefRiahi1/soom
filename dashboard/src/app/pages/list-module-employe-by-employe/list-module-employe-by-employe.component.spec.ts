import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModuleEmployeByEmployeComponent } from './list-module-employe-by-employe.component';

describe('ListModuleEmployeByEmployeComponent', () => {
  let component: ListModuleEmployeByEmployeComponent;
  let fixture: ComponentFixture<ListModuleEmployeByEmployeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListModuleEmployeByEmployeComponent]
    });
    fixture = TestBed.createComponent(ListModuleEmployeByEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
