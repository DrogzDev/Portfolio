import { Component, input } from '@angular/core';
import { ProjectLink } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-links',
  standalone: true,
  imports: [],
  templateUrl: './project-links.html',
  styleUrl: './project-links.css'
})
export class ProjectLinksComponent {
  readonly links = input.required<ProjectLink[]>();
  readonly linksNote = input<string | undefined>(undefined);
}
