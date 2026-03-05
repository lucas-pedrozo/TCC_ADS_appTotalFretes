import { componentPT, componentEN } from "./component";
import { screenPT, screenEN } from "./screen";
import { hookPT, hookEN } from "./hook";
import { cardPT, cardEN } from "./card";

export { componentPT, componentEN } from "./component";
export { screenPT, screenEN } from "./screen";
export { hookPT, hookEN } from "./hook";
export { cardPT, cardEN } from "./card";

export const translationPT = {
  ...componentPT,
  ...screenPT,
  ...hookPT,
  ...cardPT,
} as const;

export const translationEN = {
  ...componentEN,
  ...screenEN,
  ...hookEN,
  ...cardEN,
} as const;
