import { Component, computed, inject, input } from '@angular/core';
import { PortfolioProject, ProjectStatus } from '../../../../core/models/project.model';
import { ProjectLinksComponent } from '../project-links/project-links';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-project-hero',
  standalone: true,
  imports: [ProjectLinksComponent],
  templateUrl: './project-hero.html',
  styleUrl: './project-hero.css'
})
export class ProjectHeroComponent {
  readonly project = input.required<PortfolioProject>();
  readonly i18n = inject(LanguageService);
  readonly content = computed(() => this.i18n.content());

  statusLabel(status: ProjectStatus): string {
    return this.content().projectDetail.statusLabel[status];
  }
}
