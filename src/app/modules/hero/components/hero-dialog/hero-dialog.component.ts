import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Action, Hero, ModalObject } from '../../models/hero';

@Component({
  selector: 'app-hero-dialog',
  templateUrl: './hero-dialog.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .mat-dialog-content {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .mat-form-field {
        width: 100%;
      }
      .mat-dialog-actions {
        gap: 1rem;
        justify-content: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDialogComponent implements OnInit {
  heroForm = new FormGroup({
    id: new FormControl(this.data.hero.id),
    nameLabel: new FormControl(this.data.hero.nameLabel, [
      Validators.required,
      Validators.minLength(3),
    ]),
    genderLabel: new FormControl(this.data.hero.genderLabel, [
      Validators.required,
      Validators.minLength(3),
    ]),
    citizenshipLabel: new FormControl(this.data.hero.citizenshipLabel, [
      Validators.required,
      Validators.minLength(3),
    ]),
    occupationLabel: new FormControl(this.data.hero.occupationLabel, [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<HeroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalObject
  ) {}

  ngOnInit(): void {
    if (this.data.action === Action.DELETE) {
      this.heroForm.disable();
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ hero: '', action: Action.CANCEL });
  }

  performAction(): void {
    switch (this.data.action) {
      case Action.CREATE:
        this.saveHero();
        break;
      case Action.UPDATE:
        this.updateHero();
        break;
      default:
        this.onNoClick();
        break;
    }
  }

  saveHero(): void {
    this.dialogRef.close({
      hero: this.heroForm.value as Hero,
      action: Action.CREATE,
    });
  }

  updateHero(): void {
    this.dialogRef.close({
      hero: this.heroForm.value as Hero,
      action: Action.UPDATE,
    });
  }

  deleteHero(): void {
    this.dialogRef.close({
      hero: this.data.hero as Hero,
      action: Action.DELETE,
    });
  }
}
