import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isAuthValid } from '../helpers/auth.helper';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: []
})
export class AuthComponent implements OnInit {
  /** Введен ли некорректный пароль */
  public incorrect_password: boolean = false;
  /** Логин */
  public login: string = '';
  /** Пароль */
  public password: string = '';

  constructor(
    private readonly router: Router,
  ) {}

  /** Проверка на авторизацию и переключение в игру / неправильный авторизацию */
  ngOnInit(): void {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const [login, password] = auth.split(':');
      if (isAuthValid(login, password)) {
        this.goToGame();
      } else {
        localStorage.removeItem('auth');
        this.incorrect_password = true;
      }
    }
  }

  /** Попытка авторизации */
  public auth(): void {
    if (isAuthValid(this.login, this.password)) {
      localStorage.setItem('auth', `${this.login}:${this.password}`)
      this.goToGame();
    } else {
      this.incorrect_password = true;
    }
  }

  /** Навигация в игру */
  private goToGame() {
    this.router.navigate(['game']);
  }
}
