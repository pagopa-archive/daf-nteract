# styled-blueprintjsx

Packages up blueprint styles as a styled-components global style to subvert the need for a CSS loader.

```jsx
import { BlueprintCSS } from "@nteract/styled-blueprintjsx

<React.Fragment>
  <SuperCoolComponent />
  <BlueprintCSS />
</React.Fragment>
```

## Installation

```
npm install --save @nteract/styled-blueprintjsx
```

## Documentation

### With `@blueprintjs/core`

When working with `@blueprintjs/core` components, they need some globally defined (yet scoped) CSS. You can include this on the page with

```jsx
import { BlueprintCSS } from "@nteract/styled-blueprintjsx

<React.Fragment>
  <SuperCoolComponent />
  <BlueprintCSS />
</React.Fragment>
```

### With `@blueprintjs/select`

For `@blueprintjs/select`'s suite of components, you need to include `<BlueprintSelectCSS />` from this package.

```jsx
import { BlueprintCSS, BlueprintSelectCSS } from "@nteract/styled-blueprintjsx

<React.Fragment>
  <SuperCoolComponent />
  <BlueprintCSS />
  <BlueprintSelectCSS />
</React.Fragment>
```

Styled blueprint JSX makes use of [`createGlobalStyle` from `styled-components`](https://www.styled-components.com/docs/api#createglobalstyle) and so is a React Component you can render anywhere in your app. You can read more in the styled-components docs if

## Support

Please post an issue on the [nteract monorepo issue tracker](https://github.com/nteract/nteract).

## License
