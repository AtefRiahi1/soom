import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisfileComponent } from './devisfile.component';

describe('DevisfileComponent', () => {
  let component: DevisfileComponent;
  let fixture: ComponentFixture<DevisfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevisfileComponent]
    });
    fixture = TestBed.createComponent(DevisfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
