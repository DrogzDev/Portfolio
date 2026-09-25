import { Component, input } from '@angular/core';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [],
  templateUrl: './project-overview.html',
  styleUrl: './project-overview.css'
})
export class ProjectOverviewComponent {
  readonly description = input.required<string>();
}
