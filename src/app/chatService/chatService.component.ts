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
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-chatService',
  templateUrl: './chatService.component.html',
  styleUrls: ['./chatService.component.css'],
})
export class ChatServiceComponent implements OnInit {
  form: FormGroup;
  queryFormGroup!: FormGroup
  model: Service
  atendiment = false;
  disabled = false
  step = 0;
  messageSent = []
  messageReceived: any
  durationInSeconds = 1;

  result: any
  messages = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private readonly route: ActivatedRoute,
    private request: ServiceListService,
    private readonly router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient,
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
                id: [result.id],
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
        this.requestMessageReceived(params?.serviceId)
      }
    })
    this.queryFormGroup = this.fb.group({
      query: this.fb.control("")
    })
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
    this.request.update(this.form.value, 'service')
    setTimeout(async () => {
      await this.router.navigateByUrl('service')
    }, 2000);
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
  requestMenssage(message) {
    this.messageSent.push(message.value.message)
    this.form.get('message')?.reset();
  }
  handleAskGPT() {
    let url = "https://api.openai.com/v1/chat/completions"
    let httpHeader = new HttpHeaders()
      .set(
        "Authorization", "Bearer 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",
      )
    this.messages.push({
      role: "user",
      content: this.queryFormGroup.value.query
    })
    let payload = {
      "model": "gpt-3.5-turbo",
      "messages": this.messages,
    }
    this.httpClient.post(url, payload, { headers: httpHeader })
      .subscribe({
        next: (resp) => {
          this.result = resp
        },
        error: (error) => {
          console.log(error)
        }
      })
  }
}
