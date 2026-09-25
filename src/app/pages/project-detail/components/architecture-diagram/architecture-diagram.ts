import { Component, computed, input } from '@angular/core';
import { ProjectArchitecture } from '../../../../core/models/project.model';

interface DiagramNode {
  id: string;
  label: string;
  description: string;
}

interface DiagramGroup {
  name: string;
  nodes: DiagramNode[];
}

@Component({
  selector: 'app-architecture-diagram',
  standalone: true,
  imports: [],
  templateUrl: './architecture-diagram.html',
  styleUrl: './architecture-diagram.css'
})
export class ArchitectureDiagramComponent {
  readonly architecture = input.required<ProjectArchitecture>();
  readonly projectTitle = input.required<string>();

  readonly groups = computed<DiagramGroup[]>(() => {
    const order: string[] = [];
    const byGroup = new Map<string, DiagramNode[]>();

    for (const node of this.architecture().nodes) {
      if (!byGroup.has(node.group)) {
        byGroup.set(node.group, []);
        order.push(node.group);
      }
      byGroup.get(node.group)!.push({ id: node.id, label: node.label, description: node.description });
    }

    return order.map(name => ({ name, nodes: byGroup.get(name)! }));
  });

  isConnected(index: number): boolean {
    return !!this.findConnection(index);
  }

  connectorLabel(index: number): string | undefined {
    return this.findConnection(index)?.label;
  }

  private findConnection(index: number) {
    const groups = this.groups();
    const from = groups[index]?.name;
    const to = groups[index + 1]?.name;
    if (!from || !to) return undefined;
    return this.architecture().connections.find(c => c.from === from && c.to === to);
  }
}
