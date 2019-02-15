# @nteract/editor

This package contains components for rendering CodeMirror editors in our nteract applications. To see this package in action, you can view the source code for the [nteract play application](https://github.com/nteract/play).

## Installation

```
$ yarn add @nteract/editor
```

```
$ npm install --save @nteract/editor
```

## Usage

The example below shows how we can use this package to create a simple code editor component.

```javascript
import CodeMirrorEditor from "@nteract/editor";

<CodeMirrorEditor
  cellFocused
  editorFocused
  completion
  theme="light"
  id="just-a-cell"
  onFocusChange={() => {}}
  focusAbove={() => {}}
  focusBelow={() => {}}
  kernelStatus={"not connected"}
  options={{
    lineNumbers: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "Ctrl-Enter": () => {},
      "Cmd-Enter": () => {}
    },
    cursorBlinkRate: 0,
    mode: "python"
  }}
  value={"import pandas as pd"}
  onChange={() => {}}
/>;
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:editor` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
