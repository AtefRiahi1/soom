import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandefileComponent } from './commandefile.component';

describe('CommandefileComponent', () => {
  let component: CommandefileComponent;
  let fixture: ComponentFixture<CommandefileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandefileComponent]
    });
    fixture = TestBed.createComponent(CommandefileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
