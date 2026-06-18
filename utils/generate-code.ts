import { randomInt } from "node:crypto";

export function generateCode() {
  const LENGTH_OF_GENERATED_CODE = 6;
  let generatedString = "";

  for (let i = 0; i < LENGTH_OF_GENERATED_CODE; i++) {
    generatedString += randomInt(10).toString();
  }

  return generatedString;
}
