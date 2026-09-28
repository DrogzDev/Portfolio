import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.css'
})
export class TechStackComponent {
  readonly technologies = input.required<string[]>();
  readonly i18n = inject(LanguageService);
  readonly content = computed(() => this.i18n.content());
}
