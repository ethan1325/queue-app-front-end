import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { findIndex, Subject } from 'rxjs';
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
    //get dan sort semua data antrian yang ada
    this.queueService.getQueues().subscribe((queues) => {
      this.queues = queues.sort((a, b) => a.id > b.id ? 1 : -1);
    });
    // get dan sort semua data meja, jika data meja masih kosong, maka 4 meja akan di-inisialisasi.
    this.tableService.getTables().subscribe((tables) => {
      if (tables.length == 0) {
        this.initializeTables();
      }
      this.tables = tables.sort((a, b) => a.id > b.id ? 1 : -1);
    });
  }
  //function untuk inisialisasi meja.
  public initializeTables() {
    for (let i = 1; i <= 4; i++) {
      const newTable: Table = {
        id: i,
        status: "available"
      }
      this.tableService.saveTable(newTable).subscribe();
    }
  }

  public addQueue() {
    const newQueue: Queue = {
      id: -1,
      status: "waiting"
    }
    let empty = false;
    for (let i = 0; i < this.tables.length; i++) {
      //kalau meja tersedia
      if (!this.tables[i].queue_id && this.tables[i].status === "available") {
        //mengatur field meja di queue
        newQueue.table = this.tables[i].id;
        //mengatur data dan status meja
        if (this.queues.length === 0) {
          this.tables[i].queue_id = 1;
        } else {
          this.tables[i].queue_id = this.queues[this.queues.length - 1].id + 1;
        }
        this.tables[i].status = "booked";
        //menyimpan data meja ke db
        this.tableService.saveTable(this.tables[i]).subscribe();
        //karena ada meja kosong, maka otomatis akan di assign
        empty = true;
        newQueue.status = "assigned";
        break;
      }
    }
    //menyimpan data antrian ke db
    this.queueService.saveQueue(newQueue).subscribe((queue) => {
      //menyimpan ke client-side
      this.queues.push(queue);
      //ada meja tersedia
      if (empty) {
        Swal.fire({
          title: 'Nomor antrian: ' + queue.id,
          text: 'Mohon menuju meja ' + queue.table,
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        })
      }
      //tidak ada meja tersedia
      else {
        Swal.fire({
          title: 'Nomor antrian: ' + queue.id,
          text: 'Mohon menunggu meja kosong',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        })
      }
    });
  }

  //mencari index data front-end berdasarkan id
  public returnIndex(id: number) {
    for (let i = 0; i < this.queues.length; i++) {
      if (id === this.queues[i].id) {
        return i;
      }
    }
    return 0;
  }

  public endQueue(id: number) {
    //mencari antrian yang ingin dihapus
    let index = this.returnIndex(id);
    this.queueService.findQueue(this.queues[index!].id).subscribe((queue) => {
      //menghapus data antrian
      this.queueService.deleteQueue(this.queues[index!].id).subscribe();
      //jika antrian memiliki meja, maka ubah status meja menjadi available
      if (this.queues[index!].status === "assigned" || this.queues[index!].status === "served") {
        const newTable: Table = {
          id: this.queues[index!].table!,
          status: "available",
          time: 0
        }
        this.tableService.saveTable(newTable).subscribe();
        this.tables[newTable.id - 1] = newTable;
      }
      //menghapus data antrian di client
      this.queues.splice(index!, 1);
      //menambah class active agar carousel berjalan dengan baik
      this.carouselItems?.get(index! - 1)?.nativeElement.classList.add('active');
      let nextQueue: Queue = { id: -1, status: 'waiting' };
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].status === "waiting") {
          nextQueue = this.queues[i];
          break;
        }
      }
      if (nextQueue.id == -1) {
        Swal.fire({
          title: 'Nomor antrian ' + queue.id + ' selesai dilayani',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        })
      } else {
        for (let i = 0; i < this.tables.length; i++) {
          //kalau meja tersedia
          if (!this.tables[i].queue_id && this.tables[i].status === "available") {
            //mengatur field meja di queue
            nextQueue.table = this.tables[i].id;
            //mengatur data dan status meja
            if (this.queues.length === 0) {
              this.tables[i].queue_id = 1;
            } else {
              this.tables[i].queue_id = nextQueue.id;
            }
            this.tables[i].status = "booked";
            //menyimpan data meja ke db
            this.tableService.saveTable(this.tables[i]).subscribe();
            //karena ada meja kosong, maka otomatis akan di assign
            nextQueue.status = "assigned";
            this.queueService.updateQueue(nextQueue).subscribe();
            Swal.fire({
              title: 'Nomor antrian ' + queue.id + ' selesai dilayani',
              text: 'Antrian ' + nextQueue.id + ', mohon menuju meja ' + nextQueue.table,
              icon: 'success',
              confirmButtonText: 'OK',
              heightAuto: false
            })
            break;
          }
        }
        Swal.fire({
          title: 'Nomor antrian ' + queue.id + ' selesai dilayani',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        })
      }
    })
  }

  public assignQueue(id: number) {
    this.queueService.findQueue(this.queues[id].id).subscribe((queue) => {
      var currID = this.queues[id].id;
      queue.status = "served";
      this.queues[id] = queue;
      this.queueService.updateQueue(queue).subscribe();
      this.carouselItems?.get(0)?.nativeElement.classList.add("active");
      let updatedTable = this.tables[queue.table! - 1];
      updatedTable.status = "unavailable";
      updatedTable.time = 30;
      this.tableService.saveTable(updatedTable).subscribe();
      this.tables[queue.table! - 1] = updatedTable;
      Swal.fire({
        title: 'Anda akan dilayani di meja ' + updatedTable.id,
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      })

      var intervalID = setInterval(() => {
        if (this.tables[updatedTable.id - 1].status === "available") {
          clearInterval(intervalID);
          updatedTable.time = 0;  
        } else {
          updatedTable.time! -= 1;
          this.tables[queue.table! - 1] = updatedTable;
          this.tableService.saveTable(updatedTable).subscribe();
          if (updatedTable.time === 0) {
            this.endQueue(currID);
            clearInterval(intervalID);
          }
        }
      }, 1000);
    });
  }
}