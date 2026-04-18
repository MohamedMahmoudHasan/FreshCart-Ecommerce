import { CategoryHomeComponent } from './components/category-home/category-home.component';
import { ProductHomeComponent } from './components/product-home/product-home.component';
import { SliderHomeComponent } from './components/slider-home/slider-home.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [SliderHomeComponent, ProductHomeComponent, CategoryHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
