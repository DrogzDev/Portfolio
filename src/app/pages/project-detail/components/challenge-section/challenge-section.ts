import { Component, input } from '@angular/core';

@Component({
  selector: 'app-challenge-section',
  standalone: true,
  imports: [],
  templateUrl: './challenge-section.html',
  styleUrl: './challenge-section.css'
})
export class ChallengeSectionComponent {
  readonly challenge = input.required<string>();
}
