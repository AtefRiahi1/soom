import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortieComponent } from './sortie.component';

describe('SortieComponent', () => {
  let component: SortieComponent;
  let fixture: ComponentFixture<SortieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortieComponent]
    });
    fixture = TestBed.createComponent(SortieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
