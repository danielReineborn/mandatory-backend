import React from "react";

export function capLetter(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}

export function truncate(string) {
  let n = 15
  if (string.length > n) {
    return string.slice(0, n) + "...";
  } else {
    return string;
  }
}