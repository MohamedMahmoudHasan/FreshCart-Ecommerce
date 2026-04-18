import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-slider-home',
  imports: [RouterLink],
  templateUrl: './slider-home.component.html',
  styleUrl: './slider-home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderHomeComponent {
  slides = [
    {
      title: 'Fresh Products Delivered to your Door',
      desc: 'Get 20% off your first order',
      image: 'assets/images/slider-2.jpeg',
      btnText: 'Shop Now',
      color: 'from-primary-600/90 to-primary-400/50',
    },
    {
      title: 'Premium Quality Guaranteed',
      desc: 'Fresh from farm to your table',
      image: 'assets/images/slider-1.jpeg',
      btnText: 'View Deals',
      color: 'from-secondary/90 to-secondary/50',
    },
  ];
}
