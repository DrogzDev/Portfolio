import { Component, input } from '@angular/core';
import { ProjectDecision } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-decisions',
  standalone: true,
  imports: [],
  templateUrl: './project-decisions.html',
  styleUrl: './project-decisions.css'
})
export class ProjectDecisionsComponent {
  readonly decisions = input.required<ProjectDecision[]>();
}
