# @nteract/directory-listing

This package contains components that can be used to create a listing of items within a directory. To see this package in action, you can view the source code for the [nteract commuter application](https://github.com/nteract/commuter).

## Installation

```
$ yarn add @nteract/directory-listing
```

```
$ npm install --save @nteract/directory-listing
```

## Usage

The example below shows how we can use the components within this package to create a listing of the items in a directory.

```javascript
import { Listing, Entry, Icon, Name, LastSaved } from "@nteract/directory-listing";

export function () => <Listing>
  <Entry>
    <Icon fileType="notebook" />
    <Name>
      <a href="#listing">GANS-for-days.ipynb</a>
    </Name>
    <LastSaved lastModified="2018-06-27T16:21:25.354Z" />
  </Entry>

  <Entry>
    <Icon fileType="directory" />
    <Name>
      <a href="#listing">home</a>
    </Name>
    <LastSaved lastModified="2018-03-27T16:21:25.354Z" />
  </Entry>

  <Entry>
    <Icon fileType="file" />
    <Name>
      <a href="#listing">component.js</a>
    </Name>
    <LastSaved lastModified={new Date("2018-05-27T16:21:25.354Z")} />
  </Entry>
  <Entry>
    <Icon fileType="file" color="gray" />
    <Name>
      <i style={{ color: "gray" }}>no-permission-file.md</i>
    </Name>
    <LastSaved lastModified={new Date("2018-05-27T16:21:25.354Z")} />
  </Entry>
</Listing>
```

![An example of a directory listing created using nteract components.](https://cldup.com/GEhOFUTvAN.png)

## Documentation

You can view the reference documentation for `@nteract/directory-listing` in the [component docs](https://components.nteract.io/#nteractdirectory-listing).

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:directory-listing` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
