import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-challenge-section',
  standalone: true,
  imports: [],
  templateUrl: './challenge-section.html',
  styleUrl: './challenge-section.css'
})
export class ChallengeSectionComponent {
  readonly challenge = input.required<string>();
  readonly i18n = inject(LanguageService);
  readonly content = computed(() => this.i18n.content());
}
