import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { projectsFor } from '../../data/projects.data';
import { SeoService } from '../../core/services/seo.service';
import { ProjectGalleryComponent } from '../../shared/project-gallery/project-gallery';
import { ProjectHeroComponent } from './components/project-hero/project-hero';
import { ProjectOverviewComponent } from './components/project-overview/project-overview';
import { ChallengeSectionComponent } from './components/challenge-section/challenge-section';
import { ArchitectureDiagramComponent } from './components/architecture-diagram/architecture-diagram';
import { ProjectDecisionsComponent } from './components/project-decisions/project-decisions';
import { FeatureGridComponent } from './components/feature-grid/feature-grid';
import { TechStackComponent } from './components/tech-stack/tech-stack';
import { LanguageService } from '../../core/i18n/language.service';

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
  readonly i18n = inject(LanguageService);
  readonly content = computed(() => this.i18n.content());

  readonly project = computed(() =>
    projectsFor(this.i18n.lang()).find(p => p.slug === this.slug())
  );

  constructor() {
    effect(() => {
      const project = this.project();
      if (!project) return;
      const isEn = this.i18n.lang() === 'en';
      const suffix = isEn ? 'Case study' : 'Caso de estudio';
      this.seo.update({
        title: `${project.title} — ${suffix} | Miguel Luna`,
        description: project.summary,
        path: `/projects/${project.slug}`,
        image: project.image,
        imageAlt: project.imageAlt
      });
    });
  }
}
