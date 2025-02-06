import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacachatfileComponent } from './facachatfile.component';

describe('FacachatfileComponent', () => {
  let component: FacachatfileComponent;
  let fixture: ComponentFixture<FacachatfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacachatfileComponent]
    });
    fixture = TestBed.createComponent(FacachatfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
