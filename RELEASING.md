# :package: Let's package a release!

## Release Schedule
Unless there is an emergency bug or security fix, packages are released on a weekly cadence on Mondays. The desktop app is released on a bi-weekly cadence on Mondays. So, every Monday a package release is cut and every other Monday a desktop release is cut.

## Releasing the Packages
In order to release the JavaScript packages to npm, you will need to run the `npx lerna publish` command in the root directory. This will initialize the Lerna release process which will prompt you to set the new version numbers for each package.

## Releasing the Desktop App and Packages

### A special note for macOS

In order to build a signed copy with working auto-update, you will need to join the Apple developer program and get a certificate. The [Electron docs have a document on submitting your app to the app store](https://github.com/electron/electron/blob/master/docs/tutorial/mac-app-store-submission-guide.md), you only have to get through to the certificate step. Note, that the certificate that you will need to download from the Apple Developer Program portal is called the "3rd Party Mac Developer Application" certificate.

###  All platform precursor

To be able to publish a release you'll need to generate a GitHub access token by going to <https://github.com/settings/tokens/new>. The access token should have the `repo` scope/permission. Once you have the token, assign it to an environment variable (on macOS/linux):

```bash
export GH_TOKEN="<YOUR_TOKEN_HERE>"
```

If you are on Windows, you can assign it as an environment using the following command in Command Prompt.

```
> setx GH_TOKEN "<YOUR_TOKEN_HERE>"
```

Note that `setx` will apply the environment variable in subsequence Command Prompt sessions.

**Note: Make sure that your remote origin is set as `git@github.com:nteract/nteract.git`.**

1.  Make sure the release is working by running `yarn dist` and testing the built app inside the `./applications/desktop/dist/` folder. You can build for all platforms using `yarn dist:all`. Note that you can only build for all platforms on macOS. macOS builds cannot be built on Windows and Linux.

1.  Double check that publish will really work by running `yarn verifyBeforePublish` first

1.  Run `npx lerna publish` to publish everything, which also runs the verification steps. You will have to pick versions for everything.

1.  Run the following to ship the built desktop app

```
yarn ship:desktop
```

1.  From GitHub go to [nteract's releases](https://github.com/nteract/nteract/releases), verify everything works and edit the release notes. The name should follow our [naming guidelines](https://github.com/nteract/naming), namely that we use the last name of the next scientist in the list with an adjective in front.
    Example:

```bash
Last release: Avowed Avogadro
Next Scientist: Babbage
Next release: Babbling Babbage
```

My favorite way to pick the alliterative adjectives is using the local dictionary and our friend `grep`:

```bash
$ cat /usr/share/dict/words | grep "^babb"
babbitt
babbitter
babblative
babble
babblement
babbler
babblesome
babbling
babblingly
babblish
babblishly
babbly
babby
```

5.  Once you're ready click "Publish release". On macOS and Windows, the update will be automatically downloaded and installed.
