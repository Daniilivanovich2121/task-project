import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Todo} from '../../models/todo.model';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-create-todo',
  imports: [
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatInput,
    ReactiveFormsModule,
    MatError,
    MatCheckbox
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
    userId: [this.data?.user_id || 1, [Validators.required, Validators.min(1)]]
  })

  onNoClick() {
    this.dialogRef.close();
  }
  onSubmit() {
    this.dialogRef.close(this.createTodoForm.value);
  }
}
