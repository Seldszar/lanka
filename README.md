# lanka

> The Lanka fires a high velocity projectile through magnetic induction.

A command signature parser & matcher.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Parse](#parse)
  - [Match](#match)
- [Author](#author)
- [License](#license)

## Installation

```bash
npm install seldszar/lanka --save
```

## Usage

### Parse

#### With a required argument

```javascript
const lanka = require('lanka');
const ast = lanka.parse('hello <name>');

/*
  { type: 'signature',
    parameters: [
      { type: 'word', value: 'hello' },
      { type: 'argument',
        name: 'name',
        required: true,
        variadic: false } ]
  }
 */
console.log(ast);
```

#### With an optional argument

```javascript
const lanka = require('lanka');
const ast = lanka.parse('hello [name]');

/*
  { type: 'signature',
    parameters: [
      { type: 'word', value: 'hello' },
      { type: 'argument',
        name: 'name',
        required: false,
        variadic: false } ]
  }
 */
console.log(ast);
```

#### With a required variadic argument

```javascript
const lanka = require('lanka');
const ast = lanka.parse('hello <names...>');

/*
  { type: 'signature',
    parameters: [
      { type: 'word', value: 'hello' },
      { type: 'argument',
        name: 'name',
        required: true,
        variadic: true } ]
  }
 */
console.log(ast);
```

#### With an optional variadic argument

```javascript
const lanka = require('lanka');
const ast = lanka.parse('hello [names...]');

/*
  { type: 'signature',
    parameters: [
      { type: 'word', value: 'hello' },
      { type: 'argument',
        name: 'name',
        required: false,
        variadic: true } ]
  }
 */
console.log(ast);
```

### Match

#### With a required argument

```javascript
const lanka = require('lanka');
const ast = lanka.parse('settings <key> [value] [flags...]');
const matches = lanka.match(ast, { _: ['hello', 'seldszar'] });

/*
  { key: 'seldszar' }
 */
console.log(matches);
```

#### With an optional argument

```javascript
const lanka = require('lanka');
const ast = lanka.parse('settings <key> [value] [flags...]');
const matches = lanka.match(ast, { _: ['update', 'username', 'seldszar'] });

/*
  { key: 'username',
    value: 'seldszar' }
 */
console.log(matches);
```

#### With optional variadic arguments

```javascript
const lanka = require('lanka');
const ast = lanka.parse('settings <key> [value] [flags...]');
const matches = lanka.match(ast, { _: ['update', 'username', 'seldszar', 'space', 'ninja'] });

/*
  { key: 'username',
    value: 'seldszar',
    flags: ['space', 'ninja'] }
 */
console.log(matches);
```

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
