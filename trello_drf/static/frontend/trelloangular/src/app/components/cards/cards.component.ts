import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../models/cards';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListCardsService } from '../../services/listCards/list-cards.service';
import { ArchiveService } from '../../services/archive/archive.service';
import { AddCardService } from '../../services/addCard/add-card.service';
import { List } from '../../models/lists';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  public cards: Card[];
  @Input() boardList: List;
  submitted = false;
  editSubmitted = false;

  public is_clicked: boolean = false;
  public popoverOpen: boolean = true;

  EditCardForm: FormGroup = new FormGroup({
    cardTitle: new FormControl('', Validators.required),
  });

  CardForm: FormGroup = new FormGroup({
    cardTitle: new FormControl('', Validators.required),
  });
  get cardForm() { return this.CardForm.controls; }
  get editCardForm() { return this.EditCardForm.controls; }

  constructor(private listCardService: ListCardsService,
              private archiveService: ArchiveService,
              private addCardService: AddCardService,
              ) { }

  ngOnInit() {
    this.listCardService.cardList(this.boardList.id).subscribe(
      data => {
        this.cards = data;
      }
    );


  }

ngAfterContentChecked(): void {
  //Called after every check of the component's or directive's content.
  //Add 'implements AfterContentChecked' to the class.
  if (this.listCardService.cardsDataSource) {

    if (this.boardList.id === this.listCardService.cardsDataSource.board_list) {
      console.log(this.listCardService.cardsDataSource);
      this.cards.push(this.listCardService.cardsDataSource);
      this.listCardService.cardsDataSource = {} as Card;

    }
  }
}



  editClick(event): void {
    event.preventDefault();
    this.is_clicked = !this.is_clicked;

  }
  popoverClose(popover) {
    if (popover.isOpen()) {
      popover.close();
    }

  }

  cardEdit(cardId, index): void {
    this.editSubmitted = true;
    this.is_clicked = !this.is_clicked;
    if (this.EditCardForm.valid) {
      this.listCardService.cardEdit(this.EditCardForm.value.cardTitle, this.boardList.id, cardId).subscribe(
        data => {
          this.cards[index] = data;
        }
      );
    }
  }


  cardArchive(title, board_list, cardId, index) {
    this.archiveService.archiveCard(title, board_list, cardId).subscribe(
      data => {
        this.cards.splice(index, 1);
      }
    );

  }



  drop(event: CdkDragDrop<{}[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      let i = 0;
      for (const index of event.container.data) {
        console.log(index)
        this.listCardService.cardUpdate(index["title"],
          index["board_list"],
          index["id"], i).subscribe();
        i++;
      }

    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.listCardService.cardDrag(event.item.data.title,
                                      event.item.data.board_list,
                                      this.boardList.id,
                                      event.item.data.id,
                                      ).subscribe();
      let i = 0;
      for (const index of event.container.data) {
        this.listCardService.cardUpdate(index['title'],
        this.boardList.id,
          index['id'], i).subscribe();
        i++;
      }
    }

  }

  addCard(): void {
    this.submitted = true;
    if (this.CardForm.valid) {
      this.addCardService.addCard(this.CardForm.value.cardTitle, this.boardList.id).subscribe(
        cardData => {
          this.cards.push(cardData);
          this.CardForm.reset();
        }
      );

    }
    
  }

}


