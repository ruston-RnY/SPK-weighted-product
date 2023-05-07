import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog-warning',
  templateUrl: './dialog-warning.component.html',
  styleUrls: ['./dialog-warning.component.scss'],
})
export class DialogWarningComponent implements OnInit {
  @Input() messageDialog: any;
  @Output() closeDialog = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onCloseDialog() {
    this.closeDialog.emit(false);
  }
}
