import { Injectable, signal, effect } from '@angular/core';
import { Task } from '../models/task';

const STORAGE_KEY = 'task_manager_data';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks = signal<Task[]>([]);
  private lastId = signal(0);

  constructor() {
    this.loadFromStorage();
    this.setupAutoSave();

    if (this.tasks().length === 0) {
      this.initSampleData();
    }
  }

  private loadFromStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { tasks, lastId } = JSON.parse(savedData);
      this.tasks.set(tasks);
      this.lastId.set(lastId);
    }
  }

  private setupAutoSave() {
    effect(() => {
      const data = {
        tasks: this.tasks(),
        lastId: this.lastId()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
  }

  private initSampleData() {
    this.addTask({
      title: 'Изучить Angular',
      description: 'Освоить основы фреймворка',
      completed: false
    });
    this.addTask({
      title: 'Создать приложение',
      completed: true
    });
  }

  getTasks(): Task[] {
    return this.tasks();
  }

  getTask(id: number): Task | undefined {
    return this.tasks().find(t => t.id === id);
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      id: this.lastId() + 1,
      ...taskData,
      createdAt: new Date()
    };
    this.tasks.update(tasks => [...tasks, newTask]);
    this.lastId.update(id => id + 1);
    return newTask;
  }

  updateTask(id: number, changes: Partial<Task>) {
    this.tasks.update(tasks =>
        tasks.map(task =>
            task.id === id ? { ...task, ...changes } : task
        )
    );
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  searchTasks(term: string): Task[] {
    term = term.toLowerCase();
    return this.tasks().filter(task =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
    );
  }

  clearAllTasks() {
    this.tasks.set([]);
    this.lastId.set(0);
  }
}
