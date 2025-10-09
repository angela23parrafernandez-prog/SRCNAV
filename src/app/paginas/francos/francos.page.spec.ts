import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrancosPage } from './francos.page';

describe('FrancosPage', () => {
  let component: FrancosPage;
  let fixture: ComponentFixture<FrancosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FrancosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
