import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeAdminComponent } from './list-employe-admin.component';

describe('ListEmployeAdminComponent', () => {
  let component: ListEmployeAdminComponent;
  let fixture: ComponentFixture<ListEmployeAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeAdminComponent]
    });
    fixture = TestBed.createComponent(ListEmployeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
