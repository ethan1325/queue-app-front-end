import { Component, Input, OnInit } from '@angular/core';
import { QueueService } from '../../services/queue.service';
import { Table } from 'src/app/Table';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
  @Input() table!: Table;
  
  constructor(private queueService:QueueService) { }

  ngOnInit(): void {
    
  } 

}
