import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoarddetailService } from '../../services/boarddetail/boarddetail.service';
import { BoardListService } from '../../services/boardList/board-list.service';
import { Board } from '../../models/boards';
import { List } from '../../models/lists';
import { Card } from '../../models/cards';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { BoardsService } from '../../services/boards/boards.service';
import { ArchiveService } from '../../services/archive/archive.service';
import { ListCardsService } from '../../services/listCards/list-cards.service';




@Component({
  selector: 'app-boarddetail',
  templateUrl: './boarddetail.component.html',
  styleUrls: ['./boarddetail.component.css']
})
export class BoarddetailComponent implements OnInit {
  board: Board[];
  boardList: List[];
  archives: Card[];
  restoredCard: Card[];
  
  opened: boolean;
  clicked: boolean = false;

  @ViewChildren('closeModal') closeModal: ElementRef;

  Listform: FormGroup = new FormGroup({
    listTitle: new FormControl('', Validators.required),
  });

  EditBoardForm: FormGroup = new FormGroup({
    boardTitle: new FormControl('', Validators.required),
  });

  submitted = false;
  boardSubmitted = false;
  get listForm() { return this.Listform.controls; }
  get editBoardForm() { return this.EditBoardForm.controls; }
  
  constructor(private router: ActivatedRoute,
              private boardDetailService: BoarddetailService,
              private boardListService: BoardListService,
              private modalService: NgbModal,
              private boardService: BoardsService,
              private archiveService: ArchiveService,
              private listCardService: ListCardsService,

              ) { }

  ngOnInit() {

    const boardId = +this.router.snapshot.paramMap.get('id');
    this.boardDetailService.boardDetail(boardId).subscribe(
      data => {
        this.board = data;
    },

    );

    this.boardListService.boardList(boardId).subscribe(
      listData => {
        this.boardList = listData;
      }
    );

  }

  titleClick(event): void {
    event.preventDefault();
    this.clicked = !this.clicked;
  }

  open(content) {
    this.modalService.open(content).result.then(
      res => {
      }, error => {
        this.Listform.reset();
      }
    );
  }



  addList(): void {
    this.submitted = true;

    if (this.Listform.valid) {
      this.boardDetailService.addList(this.Listform.value.listTitle, this.board).subscribe(
        listData => {
          this.boardList.push(listData);
          this.Listform.reset();

        }
      );
    }
  }




  editBoard() {
    this.boardSubmitted = true;
    if (this.EditBoardForm.valid){
      const boardId = +this.router.snapshot.paramMap.get('id');
      this.boardService.editBoard(this.EditBoardForm.value.boardTitle, boardId ).subscribe(
        data => {
          this.board = data;
          this.clicked = !this.clicked;
      }
    );
    }
  }

  restoreCard(title, boardList, cardId, index) {
    this.archiveService.restoreCard(title, boardList, cardId).subscribe(
      data => {
        this.archives.splice(index, 1);
        this.listCardService.updateCards(data);
      }
    );
  }
  cardDelete(cardId, index): void {
    this.listCardService.cardDelete(cardId).subscribe();
    this.archives.splice(index, 1);
  }

  archiveList() {
    const boardId = +this.router.snapshot.paramMap.get('id');
    this.archiveService.archiveList(boardId).subscribe(
      cardData => {
        this.archives = cardData;
      }
    );
  }



}
