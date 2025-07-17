import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {TodoListComponent} from './features/todo/components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TodoListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'My Angular App';
}
