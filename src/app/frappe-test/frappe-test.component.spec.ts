import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrappeTestComponent } from './frappe-test.component';

describe('FrappeTestComponent', () => {
  let component: FrappeTestComponent;
  let fixture: ComponentFixture<FrappeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrappeTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrappeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
