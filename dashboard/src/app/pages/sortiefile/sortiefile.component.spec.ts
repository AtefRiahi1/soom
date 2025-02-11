import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortiefileComponent } from './sortiefile.component';

describe('SortiefileComponent', () => {
  let component: SortiefileComponent;
  let fixture: ComponentFixture<SortiefileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortiefileComponent]
    });
    fixture = TestBed.createComponent(SortiefileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
