
import assert from "assert";
import { User } from "../src/lib/services/User";
import * as Types from "../src/lib/types/types";

function runTests() {
  // 1. Creation & immutability
  const alena = new User("Alena", "123");
  assert.strictEqual(alena.name, "Alena");
  assert.strictEqual(alena.id, "123");

  console.log("Tests passed!");
}

runTests();
