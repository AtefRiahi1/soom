import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturefileComponent } from './facturefile.component';

describe('FacturefileComponent', () => {
  let component: FacturefileComponent;
  let fixture: ComponentFixture<FacturefileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturefileComponent]
    });
    fixture = TestBed.createComponent(FacturefileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
