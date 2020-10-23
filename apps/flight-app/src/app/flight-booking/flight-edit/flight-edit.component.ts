import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent implements OnInit {
  id: string;
  showDetails: string;
  showWarning = false;

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {

      this.formGroup = this.formBuilder.group({
        'id': ['0', Validators.required],
        'from': [],
        'to': [],
        'date': []
      });

      // this.formGroup.controls['from'].valueChanges
      // this.formGroup.valueChanges;

  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.id = p['id'];
      this.showDetails = p['showDetails'];
    });
  }

}
