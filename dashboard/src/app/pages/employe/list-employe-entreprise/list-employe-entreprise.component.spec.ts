import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeEntrepriseComponent } from './list-employe-entreprise.component';

describe('ListEmployeEntrepriseComponent', () => {
  let component: ListEmployeEntrepriseComponent;
  let fixture: ComponentFixture<ListEmployeEntrepriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeEntrepriseComponent]
    });
    fixture = TestBed.createComponent(ListEmployeEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
