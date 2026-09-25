import { Component, input } from '@angular/core';
import { PortfolioProject, ProjectStatus } from '../../../../core/models/project.model';
import { ProjectLinksComponent } from '../project-links/project-links';

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'En producción',
  demo: 'Demo pública',
  private: 'Proyecto privado',
  'in-development': 'En desarrollo'
};

@Component({
  selector: 'app-project-hero',
  standalone: true,
  imports: [ProjectLinksComponent],
  templateUrl: './project-hero.html',
  styleUrl: './project-hero.css'
})
export class ProjectHeroComponent {
  readonly project = input.required<PortfolioProject>();

  statusLabel(status: ProjectStatus): string {
    return STATUS_LABEL[status];
  }
}
