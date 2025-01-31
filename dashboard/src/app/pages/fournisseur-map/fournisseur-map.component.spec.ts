import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurMapComponent } from './fournisseur-map.component';

describe('FournisseurMapComponent', () => {
  let component: FournisseurMapComponent;
  let fixture: ComponentFixture<FournisseurMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FournisseurMapComponent]
    });
    fixture = TestBed.createComponent(FournisseurMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
