#Original
![here](https://github.com/luridev/qr-github-generator)

# qr-github-generator

App for generating QR codes with Original, e-drop, and Nowaste appearance presets and export to SVG/PNG/JPEG/WEBP format.

## Presets

| Preset | Foreground | Background | Padding | Logo |
| --- | --- | --- | --- | --- |
| Original (default) | `#000000` | `#FFFFFF` | Off | Original GitHub logo |
| e-drop | `#1E6372` | `#FFFFFF` | On | Supplied e-drop image |
| Nowaste | `#91B11B` | `#FFFFFF` | On | Supplied Nowaste image |

Selecting a preset applies its appearance while keeping the QR data, export format, and export size. Brand logos are embedded in downloaded files, including SVGs.

### Scan verification

The requested Nowaste green is retained exactly. A 900-pixel Nowaste PNG containing `https://example.com/qr-presets-check?brand=demo` decoded successfully with ZXing's global histogram decoder, but not with jsQR or ZXing's adaptive decoder. The matching e-drop and Original PNGs passed all three checks. Verify the Nowaste preset with the intended scanner before printing; the foreground color remains editable if a darker color is needed.

**Vue CLI** + **Element Plus** (with **auto-import** plugin) + **QRCode-SVG** + **File-Saver**.

![luridev](https://user-images.githubusercontent.com/89837623/161449153-8d2e3cf5-9a54-406c-a45d-69dec4793cbd.png)


## GitHub Pages

GitHub Actions deploys the site from `main` to GitHub Pages. In **Settings > Pages**, select **GitHub Actions** as the source. The project URL is `https://jesperasv.github.io/qr-code-work/`.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
