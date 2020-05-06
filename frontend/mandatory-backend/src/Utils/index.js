import React from "react";

export function capLetter(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}

export function truncate(string) {
  if (string.length > 15) {
    return string.slice(0, 14) + "...";
  } else {
    return string;
  }
}