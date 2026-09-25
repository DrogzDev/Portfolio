import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from './data/projects.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return PROJECTS.map((project) => ({ slug: project.slug }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
