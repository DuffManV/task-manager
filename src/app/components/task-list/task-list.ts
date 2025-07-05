import { Component, inject, computed } from '@angular/core';
import { TaskService } from '../../services/task';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../task-form/task-form';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskList {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  searchTerm = '';
  tasks = computed(() => {
    const allTasks = this.taskService.getTasks();
    if (!this.searchTerm.trim()) return allTasks;
    return this.taskService.searchTasks(this.searchTerm);
  });

  addTask() {
    const dialogRef = this.dialog.open(TaskForm, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Задача добавлена', 'Закрыть', { duration: 3000 });
      }
    });
  }

  toggleComplete(id: number, completed: boolean) {
    this.taskService.updateTask(id, { completed });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
    this.snackBar.open('Задача удалена', 'Закрыть', { duration: 3000 });
  }

  viewDetails(id: number) {
    this.router.navigate(['/tasks', id]);
  }

  clearAll() {
    if (confirm('Удалить все задачи?')) {
      this.taskService.clearAllTasks();
      this.snackBar.open('Все задачи удалены', 'Закрыть', { duration: 3000 });
    }
  }

  onSearchChange() {
    this.tasks = computed(() => {
      if (!this.searchTerm.trim()) {
        return this.taskService.getTasks();
      }
      return this.taskService.searchTasks(this.searchTerm);
    });
  }
}
