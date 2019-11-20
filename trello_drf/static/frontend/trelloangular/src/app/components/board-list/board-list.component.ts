import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListCardsService } from '../../services/listCards/list-cards.service';
import { BoardListService } from '../../services/boardList/board-list.service';
import { AddCardService } from '../../services/addCard/add-card.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { List } from '../../models/lists';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { BoarddetailService } from '../../services/boarddetail/boarddetail.service';
import { Card } from '../../models/cards';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit {
  boardList: List[];
  is_open: boolean = false;
   indx : number =0;

  EditListForm: FormGroup = new FormGroup({
    listTitle: new FormControl('', Validators.required),
  });

  Listform: FormGroup = new FormGroup({
    listTitle: new FormControl('', Validators.required),
  });
  get listForm() { return this.Listform.controls; }
  submitted = false;

  constructor(private router: ActivatedRoute,
              private listCardsServerice: ListCardsService,
              private boardListService: BoardListService,
              private addCardService: AddCardService,
              private modalService: NgbModal,
              private boardDetailService: BoarddetailService,
              ) { }

  ngOnInit() {
    const boardId = +this.router.snapshot.paramMap.get('id');
    this.boardListService.boardList(boardId).subscribe(
      listData => {
        this.boardList = listData;
      }
    );

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
    const boardId = +this.router.snapshot.paramMap.get('id');

    if (this.Listform.valid) {
      this.boardDetailService.addList(this.Listform.value.listTitle, boardId).subscribe(
        listData => {
          this.boardList.push(listData);
          this.Listform.reset();

        }
      );
    }
  }


  editList(board, listId, index): void {
    
    this.is_open = !this.is_open;
    this.addCardService.editList(this.EditListForm.value.listTitle, board, listId).subscribe(
      data => {
        this.boardList[index] = data;
      }
    );
  }

  deleteList(listId, index): void {
    
    this.boardListService.deleteList(listId).subscribe();
    this.boardList.splice(index, 1);
    
  }

  

  titleClick(event,index): void {
    event.preventDefault();
    if (this.indx === index && this.is_open) {
      this.indx = null;
      this.is_open = false;

    } else {
      this.indx = index;
      this.is_open = true;

    }
  }





}
