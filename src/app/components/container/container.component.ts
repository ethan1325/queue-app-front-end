import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Queue } from 'src/app/Queue';
import { QueueService } from 'src/app/services/queue.service';
import { TableService } from 'src/app/services/table.service';
import { Table } from 'src/app/Table';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  queues: Queue[] = [];
  tables: Table[] = [];
  @ViewChildren('carouselItems') carouselItems?: QueryList<ElementRef>;

  constructor(private queueService: QueueService, private tableService: TableService) { }

  ngOnInit(): void {
    this.queueService.getQueues().subscribe((queues) => {
      this.queues = queues.sort((a, b) => a.id > b.id ? 1 : -1);
    });
    this.tableService.getTables().subscribe((tables) => {
      if (tables.length == 0) {
        this.initializeTables();
      }
      this.tables = tables.sort((a, b) => a.id > b.id ? 1 : -1);
    });
  }

  public initializeTables() {
    for (let i = 1; i <= 4; i++) {
      const newTable: Table = {
        id: i
      }
      this.tableService.saveTable(newTable).subscribe();
    }
  }

  public addQueue() {
    const newQueue: Queue = {
      id: -1
    }
    let empty = false;
    for (let i = 0; i < this.tables.length; i++) {
      if (!this.tables[i].queue_id) {
        newQueue.table = this.tables[i].id;
        if (this.queues.length === 0) {
          this.tables[i].queue_id = 1;
        } else {
          this.tables[i].queue_id = this.queues[this.queues.length - 1].id + 1;
        }
        this.tableService.saveTable(this.tables[i]).subscribe();
        empty = true;
        break;
      }
    }
    this.queueService.saveQueue(newQueue).subscribe((queue) => {
      this.queues.push(queue);
      if (empty) {
        Swal.fire({
          title: 'Nomor antrian: ' + queue.id,
          text: 'Mohon menuju meja ' + queue.table,
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }
      else {
        Swal.fire({
          title: 'Nomor antrian: ' + queue.id,
          text: 'Mohon menunggu meja kosong',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }
    });

  }

  public endQueue(id: number) {
    this.queueService.findQueue(this.queues[id].id).subscribe((queue)=> {
      this.queueService.deleteQueue(this.queues[id].id).subscribe();
      if(this.queues[id].table){
        const newTable: Table = {
          id: this.queues[id].table!
        }
        console.log(newTable);
        this.tableService.saveTable(newTable).subscribe();
        this.tables[newTable.id-1] = newTable;
      }
      this.queues.splice(id, 1);
      this.carouselItems?.get(id-1)?.nativeElement.classList.add('active');
      Swal.fire({
        title: 'Nomor antrian ' + queue.id + ' berhasil dihapus',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    })
  }

  public assignTable(){

  }
}