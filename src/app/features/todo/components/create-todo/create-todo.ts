import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './create-todo.html',
  styleUrl: './create-todo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTodo {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateTodo>);
  data = inject<Todo>(MAT_DIALOG_DATA);

  public createTodoForm: FormGroup = this.fb.group({
    todo: [this.data?.todo || '', [Validators.required, Validators.minLength(3)]],
    completed: [this.data?.completed || false],
    userId: [this.data?.userId || 1, [Validators.required, Validators.min(1)]]
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
      this.dialogRef.close(this.createTodoForm.value);
  }
}
