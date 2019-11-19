import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListCardsService } from '../../services/listCards/list-cards.service';
import { BoardListService } from '../../services/boardList/board-list.service';
import { AddCardService } from '../../services/addCard/add-card.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { List } from '../../models/lists';
import { Card } from '../../models/cards';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit {
  @Input() boardList: List;
  
  listCards: Card[];

  is_open: boolean = false;


  EditListForm: FormGroup = new FormGroup({
    listTitle: new FormControl('', Validators.required),
  });

  constructor(
              private listCardsServerice: ListCardsService,
              private boardListService: BoardListService,
              private addCardService: AddCardService,
              ) { }

  ngOnInit() {

    this.listCardsServerice.cardList(this.boardList.id).subscribe(
      cardData => {
        this.listCards = cardData;

      }
    );
  }





  editList(): void {
    this.boardList.title = this.EditListForm.value.listTitle;
    this.is_open = !this.is_open;
    this.addCardService.editList(this.EditListForm.value.listTitle, this.boardList.board, this.boardList.id).subscribe();
  }

  deleteList(): void {
    this.boardListService.deleteList(this.boardList.id).subscribe();
    
  }

  

  titleClick(event): void {
    event.preventDefault();
    this.is_open = !this.is_open;
  }


  drop(event: CdkDragDrop<{}[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.listCardsServerice.cardDrag(event.item.data.title,
                                      event.item.data.board_list,
                                      this.boardList.id,
                                      event.item.data.id,
                                      ).subscribe();

    }
  }



}
