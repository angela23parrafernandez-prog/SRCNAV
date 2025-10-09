import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuardiaPage } from './guardia.page';

describe('GuardiaPage', () => {
  let component: GuardiaPage;
  let fixture: ComponentFixture<GuardiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
