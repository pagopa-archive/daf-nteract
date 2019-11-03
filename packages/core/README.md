# @nteract/core

This package is a package the encapsulates and exports the packages defined in `@nteract/actions`, `@nteract/reducers`, `@nteract/epics`, `@nteract/types`, and `@nteract/selectors`.

## Installation

```
$ yarn add @nteract/core
```

```
$ npm install --save @nteract/core
```

## Usage

The example below shows how we can use the functions within this package to set the `isSaving` property on a notebook state. Note that this is the same example code for the @nteract/reducers package, but we are able to use a single dependency on the `@nteract/core` package to deliver the functionality instead of relying on different dependencies.

```javascript
import { state, reducers, actions } from "@nteract/core";

export default () => {
  const originalState = state.makeAppRecord({
    isSaving: true
  });
  reducers.core.app(originalState, actions.saveFulfilled({}));
};
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:core` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
