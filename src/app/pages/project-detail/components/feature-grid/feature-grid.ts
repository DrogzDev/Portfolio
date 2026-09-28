import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-feature-grid',
  standalone: true,
  imports: [],
  templateUrl: './feature-grid.html',
  styleUrl: './feature-grid.css'
})
export class FeatureGridComponent {
  readonly features = input.required<string[]>();
  readonly i18n = inject(LanguageService);
  readonly content = computed(() => this.i18n.content());
}
