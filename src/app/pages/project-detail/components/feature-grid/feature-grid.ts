import { Component, input } from '@angular/core';

@Component({
  selector: 'app-feature-grid',
  standalone: true,
  imports: [],
  templateUrl: './feature-grid.html',
  styleUrl: './feature-grid.css'
})
export class FeatureGridComponent {
  readonly features = input.required<string[]>();
}
