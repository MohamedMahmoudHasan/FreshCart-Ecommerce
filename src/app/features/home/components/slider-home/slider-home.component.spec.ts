import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderHomeComponent } from './slider-home.component';

describe('SliderHomeComponent', () => {
  let component: SliderHomeComponent;
  let fixture: ComponentFixture<SliderHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
