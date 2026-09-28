import { Component, computed, inject, input } from '@angular/core';
import { ProjectDecision } from '../../../../core/models/project.model';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-project-decisions',
  standalone: true,
  imports: [],
  templateUrl: './project-decisions.html',
  styleUrl: './project-decisions.css'
})
export class ProjectDecisionsComponent {
  readonly decisions = input.required<ProjectDecision[]>();
  readonly i18n = inject(LanguageService);
  readonly content = computed(() => this.i18n.content());
}
