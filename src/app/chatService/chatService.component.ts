import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceListService } from 'app/table-list/service/serviceList.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Service } from 'assets/model/service-model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-chatService',
  templateUrl: './chatService.component.html',
  styleUrls: ['./chatService.component.css'],
})
export class ChatServiceComponent implements OnInit {
  form: FormGroup;
  model: Service
  atendiment = false;
  disabled = false
  step = 0;
  messageSent: any
  messageReceived: any
  durationInSeconds = 1;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private readonly route: ActivatedRoute,
    private request: ServiceListService,
    private readonly router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      if (params?.serviceId !== undefined && params?.serviceId !== null) {
        this.request.getById(params?.serviceId, 'service').subscribe(
          {
            next: (result) => {
              this.model = result
              this.form = this.fb.group({
                serviceAt: [result.serviceAt],
                context: [result.context],
                serviceAnd: [result.serviceAnd],
                status: [result.status],
                message: '',
                person: this.fb.group({
                  name: [result.person.name],
                  cpf: [result.person.cpf],
                  phone: [result.person.phone],
                }),
                adress: this.fb.group({
                  city: [result.person.adress.city],
                  state: [result.person.adress.state],
                  postalCode: [result.person.adress.postalCode],
                })
              });
            },
            error: (error) => {
              throw error;
            },
          }
        )
        this.requestMessageSent(params?.serviceId)
        this.requestMessageReceived(params?.serviceId)
      }
    })
  }

  onSubmit(model) {
    console.log("Enviar");
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  inicilizationAttendiment() {
    this.atendiment = true;
    this.disabled = true;
  }
  finishAttendiment(model) {
    this.atendiment = false;
    this.disabled = false;
    this._snackBar.open('Atendimento encerrado', 'Fechar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['snacker-primary']
    });

    setTimeout(async () => {
      await this.router.navigateByUrl('service')
    }, 2000);
  }
  requestMessageSent(id) {
    this.request.getById(id, 'historyMessageSent').subscribe(
      {
        next: (result) => {
          this.messageSent = result;
        },
        error: (error) => {
          throw error;
        },
      })
  }
  requestMessageReceived(id) {
    this.request.getById(id, 'historyMessageReceived').subscribe(
      {
        next: (result) => {
          this.messageReceived = result;
        },
        error: (error) => {
          throw error;
        },
      })
  }
}
