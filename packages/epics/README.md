# @nteract/epics

This package contains a set of Redux-Observable epics for use in nteract applications.

## Installation

```
$ yarn add @nteract/epics
```

```
$ npm install --save @nteract/epics
```

## Usage

The example below shows how we can use the `watchExecutionStateEpic` to monitor the state of a recently launched kernel.

```javascript
import { watchExecutionStateEpic } from "@nteract/epics";

export default () => {
  // Create a Observable for the successful launch of a
  // kernel.
  const action$ = ActionsObservable.of({
      type: actionTypes.LAUNCH_KERNEL_SUCCESSFUL,
      payload: {
        kernel: {
          channels: of({
            header: { msg_type: "status" },
            content: { execution_state: "idle" }
          })
        }
      }
    });
    // Monitor the Observable and update the
    // state of the kernel on our client appropriately.
    const obs = watchExecutionStateEpic(action$);
    obs.pipe(toArray()).subscribe(
      actions => {
        const types = actions.map(({ type }) => type);
        expect(types).toEqual([actionTypes.SET_EXECUTION_STATE]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
}
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:epics` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
