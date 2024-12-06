import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDefaultComponent } from './car-default.component';

describe('CarDefaultComponent', () => {
  let component: CarDefaultComponent;
  let fixture: ComponentFixture<CarDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDefaultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
