import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';
import { SeoService } from '../../core/services/seo.service';
import { ProjectGalleryComponent } from '../../shared/project-gallery/project-gallery';
import { ProjectHeroComponent } from './components/project-hero/project-hero';
import { ProjectOverviewComponent } from './components/project-overview/project-overview';
import { ChallengeSectionComponent } from './components/challenge-section/challenge-section';
import { ArchitectureDiagramComponent } from './components/architecture-diagram/architecture-diagram';
import { ProjectDecisionsComponent } from './components/project-decisions/project-decisions';
import { FeatureGridComponent } from './components/feature-grid/feature-grid';
import { TechStackComponent } from './components/tech-stack/tech-stack';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    RouterLink,
    ProjectGalleryComponent,
    ProjectHeroComponent,
    ProjectOverviewComponent,
    ChallengeSectionComponent,
    ArchitectureDiagramComponent,
    ProjectDecisionsComponent,
    FeatureGridComponent,
    TechStackComponent
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetailComponent {
  readonly slug = input.required<string>();

  private readonly seo = inject(SeoService);

  readonly project = computed(() => PROJECTS.find(p => p.slug === this.slug()));

  constructor() {
    effect(() => {
      const project = this.project();
      if (!project) return;
      this.seo.update({
        title: `${project.title} — Caso de estudio | Miguel Luna`,
        description: project.summary,
        path: `/projects/${project.slug}`,
        image: project.image,
        imageAlt: project.imageAlt
      });
    });
  }
}
