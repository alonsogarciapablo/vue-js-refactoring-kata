# Vue.js Refactoring Kata

The goal of this kata is to learn and apply concepts from Domain-driven Design and Layered Architecture to some existing code.

## Setting up the project

1. Checkout the project

```bash
git clone https://github.com/alonsogarciapablo/vue-js-refactoring-kata.git

```

2. Install dependencies

```bash
npm install

```

3. Run the tests

```bash
npm run test

```

4. Run the app

```bash
npm run serve
```

5. You're ready to go! 👏

## Exercises

### 1. Decouple Application logic from the User Interface logic

1. Define a `RegisterUser` class with an empty constructor and an `execute` method.
2. Copy the content of the `submit` function to the new `execute` method. Define a parameter for each of the missing variables (eg: refs) and define a variable to hold the return value (hint: the errors), removing any Vue.js code (eg: refs).
3. Create an instance of the `RegisterUser` class and use it in the submit function.
4. Extract the new class to its own file: `src/application/use-cases/register-user.ts`.
5. Take a moment to think how much easier it would be to replace Vue.js with something else now.

```typescript
class RegisterUser {
  constructor(...) {
    …
  }

  execute(): ??? {
    …
  }
}
```

Solution: https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/main...refactor-step-1

### 2. Revert the dependency between `SignupView` and `InMemoryUserRepository`

1. Define a `UsersRepository` interface in the file where `InMemoryUsersRepository` is defined.
2. Make `InMemoryUserRepository` implement the new `UserRepository` interface.
3. Extract `UserRepository` to its own file: `src/domain/repositories/users-repository.ts`.
4. Use `UserRepository` in `RegisterUser`.
5. Rename `inMemoryUsersRepository` to `usersRepository` in `SignupView`.
6. Use [App-level provide](https://vuejs.org/guide/components/provide-inject.html#app-level-provide) to inject the `UserRepository` in `SignupView`. Mock the provide/inject using [global.provide](https://test-utils.vuejs.org/api/#global) in the tests.
7. Take a moment to think how easy it’d be to implement and use a different `UserRepository`.

```typescript
interface UsersRepository {
  add: (user: User) => void
  
  …
  
}

class InMemoryUsersRepository
  implements UsersRepository {
  … 
}


Solution: https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/refactor-step-1...refactor-step-2

```
### 3. Domain Layer: Extract User aggregate

1. Define an empty `User` class with a `name`, `email`, `birthDate` and `encryptedPassword` attributes.
2. Create an instance of the class.
3. Define a `validate` method that returns an empty list validation errors.
4. Append the errors to the collection of errors in the view.
5. One by one, move validations* to the `User` class.
6. Extract the `User` class to its own file: `src/domain/models/user.ts`.
7. Use `User` in `inMemoryUsersRepository`, `UsersRepository` and the tests.

*⚠️i Move only the validations of the attributes that belong to the User  and don’t depend on other things like repositories (we’ll take care of those later).

```typescript
class User {
  …
  constructor(...) {
    …
  }

  validate(): Array<string> {
    …
  }
}
```

Solution: https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/refactor-step-2...refactor-step-3

### 4. Domain Layer: Extract Email value object

1. Define an empty `Email` class.
2. Create an instance of the class.
3. Define a `validate` method that returns validation errors.
4. Append email errors to the collection of errors in the `User` class.
5. Move email validations to the `Email` class.
6. Extract the `Email` class to its own file: `src/domain/models/email.ts`.
7. Move the instantiation of the `Email` to the `User` constructor

```typescript
class Email {
  constructor(...) {
    …
  }

  validate(): Array<string> {
    …
  }
}

```

Solution: https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/refactor-step-3...refactor-step-4

### 5. Domain Layer: Extract UserRegistrationService domain service

1. Define an empty `UserRegistrationService` class.
2. Create an instance of the class in the view.
3. Define an `isEmailTaken` method that returns a boolean.
4. Implement the `isEmailTaken` method (you will need to inject some dependencies first).
5. Use the new service/method in the view.
6. Extract the `UserRegistrationService` class to its own file: `src/domain/services/user-registration-service.ts`.

Solution: https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/refactor-step-4...refactor-step-5


```typescript
class UserRegistrationService {
  constructor(...) {
    …
  }

  isEmailTaken(email: string): boolean {
    …
  }
}

```

### Congrats!

You made it! 👏

Full solution: https://github.com/alonsogarciapablo/vue-js-refactoring-kata/compare/main...refactor

