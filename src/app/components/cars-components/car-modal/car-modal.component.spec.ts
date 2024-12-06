import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarModalComponent } from './car-modal.component';

describe('CarModalComponent', () => {
  let component: CarModalComponent;
  let fixture: ComponentFixture<CarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
