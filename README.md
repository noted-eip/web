# Web & Desktop

Source code of the web and desktop application for Noted.

## Install

After cloning the repository, run the following command.

```
npm install
```

## Build

You can run the dev-server using the following command.

```
npm run start
```

## Lint

To run eslint on all sources use the following command.

```
npm run lint
```

If you're running VSCode, you can configure your editor to automatically lint your files on save.

1. Install the [ESLint VSCode extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. Paste the following snippet in your VSCode settings
    ```json
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    ```
3. (Optional) If you've enabled `editor.formatOnPaste` there's a chance your files might not be linted properly. To fix it, disable this setting for `javascript`, `javascriptreact`, `typescript`, `typescriptreact`.

## Environment

| Env Name                           | Default                     | Description                               |
|------------------------------------|---------------------|-----------------------------|-------------------------------------------|
| `REACT_APP_API_BASE`            | `https://noted-rojasdiego.koyeb.app`                      | URL of the Noted API |
| `REACT_APP_TOGGLE_DEV_FEATURES`            | `0`                      | Either `0` or `1`. Toggles fast account switching and other development utilities |

