import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementComponent } from './mouvement.component';

describe('MouvementComponent', () => {
  let component: MouvementComponent;
  let fixture: ComponentFixture<MouvementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MouvementComponent]
    });
    fixture = TestBed.createComponent(MouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
