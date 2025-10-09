import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrancoPage } from './franco.page';

describe('FrancoPage', () => {
  let component: FrancoPage;
  let fixture: ComponentFixture<FrancoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FrancoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
