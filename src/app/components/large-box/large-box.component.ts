import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Queue } from 'src/app/Queue';

@Component({
  selector: 'app-large-box',
  templateUrl: './large-box.component.html',
  styleUrls: ['./large-box.component.css']
})
export class LargeBoxComponent implements OnInit {
  @Input() currentQueue?: Queue;
  @Output() onAddQueue: EventEmitter<Queue> = new EventEmitter();
  @Output() onEndqueue: EventEmitter<Queue> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  addQueue(){
    this.onAddQueue.emit();
  }

  endQueue(){
    this.onEndqueue.emit();
  }

}
