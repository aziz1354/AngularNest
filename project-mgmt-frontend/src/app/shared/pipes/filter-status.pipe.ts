import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../core/models/task.model';

@Pipe({
  name: 'filterStatus',
  standalone: true
})
export class FilterStatusPipe implements PipeTransform {
  transform(tasks: Task[], status: string): Task[] {
    if (!tasks || !status) {
      return tasks;
    }
    return tasks.filter(task => task.status === status);
  }
}

