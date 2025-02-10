import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonfileComponent } from './livraisonfile.component';

describe('LivraisonfileComponent', () => {
  let component: LivraisonfileComponent;
  let fixture: ComponentFixture<LivraisonfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivraisonfileComponent]
    });
    fixture = TestBed.createComponent(LivraisonfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
