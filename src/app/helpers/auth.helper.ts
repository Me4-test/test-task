const CORRECT_LOGIN = '1@ya.ru';
const CORRECT_PASSWORD = '010101';

/** Проверка валидации логина и пароля */
export function isAuthValid(login: string, password: string): boolean {
  return login === CORRECT_LOGIN && password === CORRECT_PASSWORD;
}
