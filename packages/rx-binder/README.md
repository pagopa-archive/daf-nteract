# rx-binder

This package provides a set of functions for connecting to a remote instance provided by [Binder](https://mybinder.org/). This package will allow you to connect to a remote compute instance from your nteract application to execute code. To see this package in action, you can view the source code for the [nteract play app](https://github.com/nteract/play).

## Installation

```
$ yarn add rx-binder
```

```
$ npm install --save rx-binder
```

## Usage

```javascript
const { binder } = require("rx-binder");

binder({ repo: "nteract/vdom" }).subscribe(msg => console.log(msg));
> { phase: 'built',
  imageName: 'gcr.io/binder-prod/prod-v4-1-nteract-vdom:78fa2b549f67afc3525543b0bccfb08a9e06b006',
  message: 'Found built image, launching...\n' }
{ phase: 'launching', message: 'Launching server...\n' }
{ phase: 'ready',
  message: 'server running at https://hub.mybinder.org/user/nteract-vdom-r115e00y/\n',
  url: 'https://hub.mybinder.org/user/nteract-vdom-r115e00y/',
  token: 'tocwpFakeToken' }
```

## Documentation

You can view the reference documentation for `rx-binder` in the [package docs](https://packages.nteract.io/modules/rx-binder).

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:rx-binder` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
