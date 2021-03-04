import { Component, OnInit } from '@angular/core';
import { isAuthValid } from '../helpers/auth.helper';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const MIN_QUESTION_NUMBER: number = 1;
const MAX_QUESTION_NUMBER: number = 1000;
const GAME_TIME: number = 10000;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styles: []
})
export class GameComponent implements OnInit {
  /** Идет ли сейчас игра */
  public is_playing: boolean = false;

  /** Крайний скор */
  public last_score: number = +(localStorage.getItem('score') || -1);
  /** Текущий скор */
  private current_score: number = 0;

  /** Информация о вопросе.
   *  text - отображаемый текст,
   *  correct_answer - правильный ответ,
   *  left - ответ который показывается с одной стороны
   *  right - ответ который показывается с другой стороны
   */
  public question: { text: string; correct_answer: number, left: number; right: number } = { text: '', correct_answer: 0, left: 0, right: 0 };

  constructor(
    private readonly router: Router,
  ) {}

  /** Проверка авторизации и редирект на авторизацию при некорректном пароле */
  ngOnInit(): void {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const [login, password] = auth.split(':');
      if (!isAuthValid(login, password)) {
        localStorage.removeItem('auth');
        this.router.navigate(['auth']);
      }
    }
  }

  /** Начало игры */
  public play() {
    this.generateNextQuestion();
    this.is_playing = true;
    of(true).pipe(delay(GAME_TIME)).subscribe(() => {
      this.done();
    });
  }

  /** Обработка клика на ответ */
  public click(int: number) {
    if (int === this.question.correct_answer) {
      this.current_score++;
    }

    this.generateNextQuestion();
  }

  /** Завершение игры */
  private done() {
    this.is_playing = false;

    if (this.current_score > this.last_score) {
      localStorage.setItem('score', `${this.current_score}`);
      this.last_score = this.current_score;
    }

    this.current_score = 0;
  }

  /** Генерация нового вопроса */
  private generateNextQuestion() {
    let random_left: number = Math.floor(MIN_QUESTION_NUMBER + Math.random() * (MAX_QUESTION_NUMBER + 1 - MIN_QUESTION_NUMBER));
    let random_right: number = Math.floor(MIN_QUESTION_NUMBER + Math.random() * (MAX_QUESTION_NUMBER + 1 - MIN_QUESTION_NUMBER));

    const random_symbol: number = Math.floor(1 + Math.random() * 4);

    let correct_answer: number;
    let symbol: string = '';

    switch (random_symbol) {
      case 1:
        symbol = '+';
        correct_answer = random_left + random_right;
        break;
      case 2:
        symbol = '-';
        correct_answer = random_left - random_right;
        break;
      case 3:
        symbol = '*';
        correct_answer = random_left * random_right;
        break;
      case 4:
        symbol = '/';
        if (random_left < random_right) {
          const tmp = random_left;
          random_left = random_right;
          random_right = tmp;
        }
        if (random_left % random_right > 0) {
          random_left += random_right - random_left % random_right;
        }
        correct_answer = random_left / random_right;
        break;
      default:
        return;
    }

    const random_salt_min = Math.min(random_left, Math.min(random_right, correct_answer));
    const random_salt_max = Math.max(random_left, Math.max(random_right, correct_answer));
    const random_salt = Math.floor(random_salt_min + Math.random() * (random_salt_max + 1 - random_salt_min));

    this.question = {
      correct_answer,
      left: random_salt,
      right: correct_answer,
      text: `${random_left} ${symbol} ${random_right}`
    }
  }
}
