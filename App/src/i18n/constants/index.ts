import { componentPT, componentEN } from "./component";
import { screenPT, screenEN } from "./screen";
import { hookPT, hookEN } from "./hook";

export { componentPT, componentEN } from "./component";
export { screenPT, screenEN } from "./screen";
export { hookPT, hookEN } from "./hook";

export const translationPT = {
  ...componentPT,
  ...screenPT,
  ...hookPT,
} as const;

export const translationEN = {
  ...componentEN,
  ...screenEN,
  ...hookEN,
} as const;
