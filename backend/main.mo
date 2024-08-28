import Text "mo:base/Text";

import Float "mo:base/Float";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

actor Calculator {
  public func calculate(operation: Text, num1: Float, num2: Float) : async Float {
    switch (operation) {
      case ("+") { return num1 + num2; };
      case ("-") { return num1 - num2; };
      case ("*") { return num1 * num2; };
      case ("/") {
        if (num2 == 0) {
          Debug.print("Error: Division by zero");
          throw Error.reject("Division by zero");
        };
        return num1 / num2;
      };
      case (_) {
        Debug.print("Error: Invalid operation");
        throw Error.reject("Invalid operation");
      };
    };
  };
}