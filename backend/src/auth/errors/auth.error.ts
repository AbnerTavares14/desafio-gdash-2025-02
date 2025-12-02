export class AuthenticationFailed extends Error {
  constructor() {
    super(`Email or Password incorrect!`);
  }
}
