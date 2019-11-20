import { Component, OnInit } from '@angular/core';
import { Board } from '../../models/boards';
import { Router } from '@angular/router';
import { BoardsService } from '../../services/boards/boards.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateboardService } from '../../services/createboard/createboard.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {
  boards: Board[];
  AddBoardForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required)
  });
  submitted = false;
  get f() { return this.AddBoardForm.controls; }

  constructor(private router: Router, private boardService: BoardsService,private createBoardService: CreateboardService) { }

  ngOnInit() {

    this.boardService.boardList().subscribe(
      boardData => {
        this.boards = boardData;
      });
  }

  createBoard(): void {
    this.submitted = true;
    if (this.AddBoardForm.valid) {
      this.createBoardService.createBoard(this.AddBoardForm.value.title).subscribe(
        boardData => {
          this.boards.push(boardData);
          this.AddBoardForm.reset();
          this.submitted = false;
        }
        );
    }


  }

}
