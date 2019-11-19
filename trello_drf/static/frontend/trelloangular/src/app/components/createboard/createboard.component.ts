import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateboardService } from '../../services/createboard/createboard.service';

@Component({
  selector: 'app-createboard',
  templateUrl: './createboard.component.html',
  styleUrls: ['./createboard.component.css']
})
export class CreateboardComponent implements OnInit {
  form: FormGroup = new FormGroup({
    boardTitle: new FormControl('', Validators.required),
  });

  constructor(private createBoardService: CreateboardService) { }

  ngOnInit() {

  }

  createBoard(): void {
    if (this.form.valid) {
      this.createBoardService.createBoard(this.form.value.boardTitle).subscribe(
        boardData => {
          console.log(boardData);
        }
        );
    }

  }


}
