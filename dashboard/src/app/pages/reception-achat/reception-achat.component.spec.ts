import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionAchatComponent } from './reception-achat.component';

describe('ReceptionAchatComponent', () => {
  let component: ReceptionAchatComponent;
  let fixture: ComponentFixture<ReceptionAchatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionAchatComponent]
    });
    fixture = TestBed.createComponent(ReceptionAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
