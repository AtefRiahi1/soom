import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModuleEmployeEntrepriseComponent } from './list-module-employe-entreprise.component';

describe('ListModuleEmployeEntrepriseComponent', () => {
  let component: ListModuleEmployeEntrepriseComponent;
  let fixture: ComponentFixture<ListModuleEmployeEntrepriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListModuleEmployeEntrepriseComponent]
    });
    fixture = TestBed.createComponent(ListModuleEmployeEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
