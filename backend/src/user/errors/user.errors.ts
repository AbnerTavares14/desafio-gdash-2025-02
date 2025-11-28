export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class UserNotFound extends Error {
  constructor() {
    super(`User not found`);
  }
}
