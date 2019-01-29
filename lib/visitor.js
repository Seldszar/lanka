const some = require("lodash.some");
const { BaseCstVisitor } = require("./parser");

class Visitor extends BaseCstVisitor {
  word(ctx) {
    return {
      type: "word",
      value: ctx.StringLiteral[0].image,
    };
  }

  requiredArgument(ctx) {
    return {
      type: "argument",
      name: ctx.StringLiteral[0].image,
      required: true,
      variadic: !!ctx.Ellipsis,
    };
  }

  optionalArgument(ctx) {
    return {
      type: "argument",
      name: ctx.StringLiteral[0].image,
      required: false,
      variadic: !!ctx.Ellipsis,
    };
  }

  parameter(ctx) {
    if (ctx.word) {
      return this.visit(ctx.word);
    }

    if (ctx.requiredArgument) {
      return this.visit(ctx.requiredArgument);
    }

    if (ctx.optionalArgument) {
      return this.visit(ctx.optionalArgument);
    }

    throw new Error("Unknown parameter");
  }

  signature(ctx) {
    const parameters = [];

    for (const node of ctx.parameter) {
      const parameter = this.visit(node);

      if (some(parameters, { variadic: true })) {
        throw new Error("Parameter after a variadic argument");
      }

      if (parameter.type === "word") {
        if (some(parameters, { type: "argument", required: false })) {
          throw new Error("Word after an optional argument");
        }
      }

      if (parameter.type === "argument") {
        if (parameter.required) {
          if (some(parameters, { type: "argument", required: false })) {
            throw new Error("Required argument after an optional");
          }
        }

        if (some(parameters, { type: "argument", name: parameter.name })) {
          throw new Error("Argument with the same name");
        }
      }

      parameters.push(parameter);
    }

    return {
      type: "signature",
      parameters,
    };
  }
}

module.exports = Visitor;
