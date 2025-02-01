import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeAchatComponent } from './commande-achat.component';

describe('CommandeAchatComponent', () => {
  let component: CommandeAchatComponent;
  let fixture: ComponentFixture<CommandeAchatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeAchatComponent]
    });
    fixture = TestBed.createComponent(CommandeAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
