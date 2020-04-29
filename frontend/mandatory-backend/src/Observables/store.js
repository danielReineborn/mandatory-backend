import { BehaviorSubject } from "rxjs";

export const userName$ = new BehaviorSubject(localStorage.getItem("userName"));

export function updateName(newName) {
  if (newName) { //Truthy === token is set. Otherwise token is null === falsy.
    localStorage.setItem("userName", newToken);

  } else {
    localStorage.removeItem("token");
  }
  token$.next(newName);
}