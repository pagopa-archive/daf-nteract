# @mybinder/host-cache

This package contains a provider component that allows you to connect to a Binder instance and access its context in all child components. To see this package in action, you can view the source for the [nteract play application](https://github.com/nteract/play).

## Installation

```
$ yarn add @nteract/host-cache
```

```
$ npm install --save @nteract/host-cache
```

## Usage

The example below shows how we can use the `Host` component within this package to connect to a Binder instance and display information about the connection.

```javascript
import { Host } from "@mybinder/host-cache";

export default () => {
  return (
    <Host
      repo="nteract/examples"
      gitRef="master"
      binderURL="https://mybinder.org"
    >
      <p>We've connected to a Binder instance within this context.</p>
      <p>
        But now we need to retrieve some information about the Binder context we
        are connected to.
      </p>
      <p>So let's use the "Host.Consumer" component!</p>
      <Host.Consumer>
        {host =>
          host ? (
            <pre>
              Endpoint: {host.endpoint}
              Token: {host.token}
            </pre>
          ) : null
        }
      </Host.Consumer>
    </Host>
  );
};
```

## Documentation

You can view the reference documentation for `@mybinder/host-cache` in the [component docs](https://components.nteract.io/#mybinderhost-cache).

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:host-cache` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
