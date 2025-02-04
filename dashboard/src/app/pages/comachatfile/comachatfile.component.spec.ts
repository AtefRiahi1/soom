import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComachatfileComponent } from './comachatfile.component';

describe('ComachatfileComponent', () => {
  let component: ComachatfileComponent;
  let fixture: ComponentFixture<ComachatfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComachatfileComponent]
    });
    fixture = TestBed.createComponent(ComachatfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
