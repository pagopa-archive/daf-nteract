# The nteract Package Docs

This directory is used in the build pipeline for the API documentation for the nteract core SDK.

How does it work?

Each TypeScript package in our Lerna-enabled monorepo contains documentation strings on methods and classes using TSDoc. We use TypeDoc to generate HTML doc pages from these doc strings. The web assets are compiled and stored into a `public` directory within this folder then deployed to the web using ZEIT now.

If you're interested in reading the documentation, you should probably head over to [packages.nteract.io](https://packages.nteract.io/).
