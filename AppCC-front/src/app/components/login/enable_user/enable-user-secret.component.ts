import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/user.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { AnimationSnowflakeComponent } from '../../../animations/animation-snowflake/animation-snowflake.component';
@Component({
  selector: 'app-validation-contract-secret',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavBarComponent,
    AnimationSnowflakeComponent,
  ],
  templateUrl: './enable-user-secret.component.html',
  styleUrls: ['./enable-user-secret.component.css'],
})
export class EnableAccountComponent implements OnInit, OnDestroy {
  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;
  @ViewChild('input5') input5!: ElementRef;
  secret1: string = '';
  secret2: string = '';
  secret3: string = '';
  secret4: string = '';
  secret5: string = '';
  verificationResult: boolean | null = null;
  timer: any;
  timerValue: number = 60;
  private timerCookieKey: string = 'timerValue';
  constructor(
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private cookieService: CookieService,
    private router: Router,
  ) {}
  ngOnInit() {
    const savedTimerValue = this.cookieService.get(this.timerCookieKey);
    this.timerValue = savedTimerValue ? parseInt(savedTimerValue, 10) : 60;
    this.startTimer();
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
  onSubmit() {
    const secret =
      this.secret1 + this.secret2 + this.secret3 + this.secret4 + this.secret5;
    this.validateSecret(secret);
  }
  validateSecret(secret: string) {
    this.verificationResult = null;
    this.authService.validateSecret(secret).then((result) => {
      console.log(result);
      if (result) {
        window.location.href = '/home';
      }
    });
  }
  onCloseClick(): void {
    this.dialog.closeAll();
  }
  focusNextInput(
    currentInput: HTMLInputElement,
    nextInput: HTMLInputElement | null,
  ) {
    const inputValue = currentInput.value;
    if (inputValue.length === 1 && nextInput) {
      nextInput.focus();
    }
  }
  focusPreviousInput(
    currentInput: HTMLInputElement,
    previousInput: HTMLInputElement | null,
  ) {
    if (previousInput) {
      previousInput.focus();
    }
  }
  allowInputAfterDeletion(currentInput: HTMLInputElement) {
    if (!currentInput.value) {
      setTimeout(() => {
        currentInput.focus();
      }, 0);
    }
  }
  startTimer() {
    this.timer = setInterval(() => {
      if (this.timerValue > 0) {
        this.timerValue--;
        this.cookieService.set(this.timerCookieKey, this.timerValue.toString());
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }
  resendCode() {
    clearInterval(this.timer);
    this.timerValue = 60;
    this.cookieService.set(this.timerCookieKey, this.timerValue.toString());
    this.startTimer();
  }
  get timerMinutes(): string {
    const minutes = Math.floor(this.timerValue / 60);
    return minutes < 10 ? '0' + minutes : minutes.toString();
  }
  get timerSeconds(): string {
    const seconds = this.timerValue % 60;
    return seconds < 10 ? '0' + seconds : seconds.toString();
  }
}
