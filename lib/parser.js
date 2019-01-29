const chevrotain = require("chevrotain");
const tokens = require("./tokens");

class Parser extends chevrotain.Parser {
  static get BaseCstVisitor() {
    return new Parser([]).getBaseCstVisitorConstructor();
  }

  constructor(input) {
    super(Object.values(tokens), {
      outputCst: true,
    });

    this.RULE("word", () => {
      this.CONSUME(tokens.StringLiteral);
    });

    this.RULE("requiredArgument", () => {
      this.CONSUME(tokens.LeftBracket);
      this.CONSUME2(tokens.StringLiteral);
      this.OPTION(() => {
        this.CONSUME(tokens.Ellipsis);
      });
      this.CONSUME(tokens.RightBracket);
    });

    this.RULE("optionalArgument", () => {
      this.CONSUME(tokens.LeftBrace);
      this.CONSUME2(tokens.StringLiteral);
      this.OPTION(() => {
        this.CONSUME(tokens.Ellipsis);
      });
      this.CONSUME(tokens.RightBrace);
    });

    this.RULE("parameter", () => {
      this.OR([
        { ALT: () => this.SUBRULE(this.word) },
        { ALT: () => this.SUBRULE(this.requiredArgument) },
        { ALT: () => this.SUBRULE(this.optionalArgument) },
      ]);
    });

    this.RULE("signature", () => {
      this.MANY(() => {
        this.SUBRULE(this.parameter);
      });
    });

    this.performSelfAnalysis();
    this.input = input;
  }
}

module.exports = Parser;
