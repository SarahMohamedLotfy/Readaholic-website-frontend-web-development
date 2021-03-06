import { Component, Input, OnChanges, AfterViewChecked, Output, EventEmitter, OnInit, AfterContentInit, AfterViewInit, SimpleChanges } from '@angular/core';
import { ShelfService } from './shelf.service';
import { SharedService } from 'src/app/shared.service';


/**used to add or remove a book from a shelf  */
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnChanges {

  /**the input book id from the parent component */
  @Input() bookId: number;

  /**id of the shelf */
  shelfId: number;

  /**shelves array */
  shelves: string[] = ['Read', 'Currently Reading', 'Want To Read'];

  /** the displayed shelf */
  shelfStatus: string = this.shelves[2];

  /**@ignore */
  buttonDisabled: boolean = false;

  /**@ignore */
  removeEnabled: boolean = false;

  /**
   * constructor that takes in the passes parameters 
   * @param service http service used to manipulate user shelves
   * @param sharedService a shared service to communicate between bookInfoComponent, starComponent, dropdwonComponent
   */
  constructor(private service: ShelfService, private sharedService: SharedService) { }

  /**
   *  sets the displayed shelf
   *  if the user has the specified book on a certain shelf then it displayes the shelf name other wise it's set to its default value
   * @param changes to detect changes on the component
   */
  ngOnChanges(changes: SimpleChanges) {

    this.sharedService.currentShelf.subscribe(data => {
      if (data.key != -1 && data.value != -1) {
        if (data.key == this.bookId) {
          this.shelfId = data.value;
          if (this.shelfId < 3) {
            this.shelfStatus = this.shelves[this.shelfId];
            this.buttonDisabled = true;
            this.removeEnabled = true;
          }
        }
      }
    });

    if (changes['bookId'].currentValue != null) {
      this.bookId = changes['bookId'].currentValue;
     this.getShelfId();
    }
  }

  /**changes the state of the remove button on hover
   * @param {Event} eventObj
   */
  mouseEnter(eventObj: Event) {
    var e = <HTMLElement>eventObj.srcElement;
    e.innerHTML = "&#10008; "
  }

  /**changes the state of the remove button on leave
   * @param {Event} eventObj
   */
  mouseLeave(eventObj: Event) {
    var e = <HTMLElement>eventObj.srcElement;
    e.innerHTML = "&#10003; "
  }

  /**removes a book from its shelf */
  removeBookFromShelf() {
    this.service.removeFromShelf(this.shelfId, this.bookId).subscribe((data) => {
      this.shelfStatus = this.shelves[2];
      this.sharedService.changeShelf(this.bookId,3);
      this.buttonDisabled = false;
      this.removeEnabled = false;
    })
  }

  /**gets the shelf id */
  getShelfId() {
    this.service.getShelf(this.bookId).subscribe((data) => {
      console.log(data);
      if(data.ShelfName < 3) {
        this.shelfId = data.ShelfName;
        this.shelfStatus = this.shelves[this.shelfId];
        this.sharedService.changeShelf(this.bookId, this.shelfId);
        this.buttonDisabled = true;
        this.removeEnabled = true;
      }
    });
  }


  /**adds a book to the selected shelf
   * @param {id} id of the shelf to add the book to 
   */
  addBookToShelf(id: number) {
    this.service.addToShelf(id, this.bookId).subscribe((data) => {
      this.shelfId = id;
      this.shelfStatus = this.shelves[this.shelfId]
      this.sharedService.changeShelf(this.bookId,this.shelfId);
      this.buttonDisabled = true;
      this.removeEnabled = true;
    })
  }


}
