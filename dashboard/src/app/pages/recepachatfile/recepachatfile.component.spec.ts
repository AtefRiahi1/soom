import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepachatfileComponent } from './recepachatfile.component';

describe('RecepachatfileComponent', () => {
  let component: RecepachatfileComponent;
  let fixture: ComponentFixture<RecepachatfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecepachatfileComponent]
    });
    fixture = TestBed.createComponent(RecepachatfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
