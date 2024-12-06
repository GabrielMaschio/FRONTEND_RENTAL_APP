import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalListComponent } from './rental-list.component';

describe('RentalListComponent', () => {
  let component: RentalListComponent;
  let fixture: ComponentFixture<RentalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
