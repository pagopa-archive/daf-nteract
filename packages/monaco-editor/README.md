# @nteract/monaco-editor

This package implements a React component with a Monaco-based code editor. To see this package in action, you can view the source code for rendering text files in the [nteract-on-Jupyter application](https://github.com/nteract/nteract/blob/master/applications/jupyter-extension/nteract_on_jupyter/app/contents/file/text-file.js).

## Installation

```
$ yarn add @nteract/monaco-editor
```

```
$ npm install --save @nteract/monaco-editor
```

## Usage

The example below shows how we can use this package to render an editor for plain-text content.

```javascript
import MonacoEditor from "@nteract/monaco-editor";

export default () => {
  return (
    <MonacoEditor
      theme="vscode"
      mode="text/plain"
      value={"These are some words in an editor."}
    />
  );
};
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:monaco-editor` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
