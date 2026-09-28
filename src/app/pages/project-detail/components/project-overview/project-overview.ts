import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [],
  templateUrl: './project-overview.html',
  styleUrl: './project-overview.css'
})
export class ProjectOverviewComponent {
  readonly description = input.required<string>();
  readonly i18n = inject(LanguageService);
  readonly content = computed(() => this.i18n.content());
}
