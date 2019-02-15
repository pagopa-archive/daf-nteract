# ansi-to-react

This package convert ANSI escape codes to formatted text output for React.

## Installation

```
$ yarn add ansi-to-react
```

```
$ npm install --save ansi-to-react
```

## Usage
### Basic
The example below shows how we can use this package to render a string with ANSI escape codes.

```javascript
import Ansi from "ansi-to-react";

export function () => {
  return <Ansi>
    {'\u001b[34mhello world'}
  </Ansi>;
};
```
Will render
```javascript
<code>
    <span style="color:rgb(0, 0, 187)">hello world</span>
</code>
```

### Classes
Style with classes instead of `style` attribute.
```javascript
<Ansi useClasses>
    {'\u001b[34mhello world'}
</Ansi>;
```
Will render
```javascript
<code>
    <span class="ansi-blue">hello world</span>
</code>
```

#### Class Names
|Font color| Background Color
|---|---|
|ansi-black|ansi-bright-black
|ansi-red|ansi-bright-red
ansi-green|ansi-bright-green
ansi-yellow|ansi-bright-yellow
ansi-blue|ansi-bright-blue
ansi-magenta|ansi-bright-magenta
ansi-cyan|ansi-bright-cyan
ansi-white|ansi-bright-white

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:ansi-to-react` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
