import { Component, OnInit } from '@angular/core';
import { Service } from 'assets/model/service-model';
import { ServiceListService } from './service/serviceList.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  service: any
  validate = false

  constructor(
    private request: ServiceListService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.request.getAll('service').subscribe(
      {
        next: (result) => {
          this.validate = false
          this.service = result;
        },
        error: (error) => {
          this.validate = true
          throw error;
        },
      }
    )
  }
  convertData(data) {
    return moment(data).format('DD/MM/YYYY')
  }
  convertDataHours(data) {
    return moment(data).format('HH:MM:SS')
  }
  openService(data) {
    this.router.navigateByUrl(`chat?serviceId=${data.id}`)
  }
}
