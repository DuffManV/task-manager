import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm {
  private taskService = inject(TaskService);
  private dialogRef = inject(MatDialogRef<TaskForm>);

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    completed: new FormControl(false)
  });

  submit() {
    if (this.form.valid) {
      this.taskService.addTask({
        title: this.form.value.title!,
        description: this.form.value.description || undefined,
        completed: this.form.value.completed || false
      });
      this.dialogRef.close(true);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
