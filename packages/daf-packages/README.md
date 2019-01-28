# daf-nteract-packages => @daf-nteract

## @daf-nteract/

- `MV:` daf-core => core
- `MV:` daf-types => types
- `MV:` daf-actions => actions
- `MV:` daf-reducers => reducers
- `MV:` daf-selectors => selectors
- `MV:` daf-epics => epics | operations
- `MV:` daf-logo => logo
- `MV:` daf-dataset-list => dataset-list?
- `MV:` daf-dataset-search => dataset-search | dataset-list


## daf-theme-implementation
https://github.com/teamdigitale/nteract/commit/cd925346a4bc41f38d0efd65e258c34bc95e344e

## module

- package.json?
- index.ts | package.json[main]
- isPresentational & components? & styles?
- src? & lib? & dist?
- types?
- actions
- reducers
- selectors
- operations

## duck file

- types[actions]
- actions
- reducers
- selectors
- operations

## duck folder

- types.ts
- actions.ts
- reducers.ts
- operations.ts
- selectors.ts
- index.ts

## application files structuring

### function-first approach

- actions
  - cart-actions
  - product-actions
- components
  - cart-item
  - header
- container
  - home
  - shopping-cart
- reducers
  - cart-reducer
  - login-reducer

> *Note:*  folders are named by the purpose of files inside it

### feature-first approach

- cart
  - cart-actions
  - cart-item
  - cart-reducer
  - shopping-cart
- product
  - product-actions
- common
  - home
- session
  - login-reducer

> *Note:*  folders are named by the main features of the app

### mixing both example

- main-package
  - src
    - sub-package (i.e. cart) 
      - components-folder?
        - cart-item
          - cart-item.ts
          - cart-item-styles.css
      - `named` index.ts (i.e. `cart.ts`)
      - duck-folder?

- package.json