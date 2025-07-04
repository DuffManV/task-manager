import { Routes } from '@angular/router';
import { TaskList } from './components/task-list/task-list';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./components/task-details/task-details').then(m => m.TaskDetails)
  },
  { path: '**', redirectTo: 'tasks' }
];
