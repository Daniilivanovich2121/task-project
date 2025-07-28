import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TodoListComponent} from './features/todo/components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
}
