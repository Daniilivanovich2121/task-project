import {Component, input,output,} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {Todo} from '../../models/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent {
  task = input.required<Todo>();
  taskDelete = output<Todo>();
  taskEdit = output<Todo>();


  onDelete():void {
    this.taskDelete.emit(this.task());
  }

  onEdit():void{
    this.taskEdit.emit(this.task());
  }
}
