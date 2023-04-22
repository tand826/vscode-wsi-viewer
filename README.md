# vscode-wsi-viewer README

View whole slide images (WSI) in VSCode.

## Features

- From right click menu, open a WSI file in a new tab.
- Supported extensions are the ones in [openslide](https://openslide.org/#about-openslide)
  - "svs", "tif", "vms", "vmu", "ndpi", "scn", "mrxs", "tiff", "svslide", "bif"

## Requirements

This extension needs wsiserver for patcing and serving WSI files.
- Install python>=3.6 and [wsiserver](https://github.com/tand826/wsiserver).
  - `pip install wsiserver`


## Extension Settings

- Available settings
  - TO BE ADDED
    - wsiviewer.url_template (default: "/{url}:{port}/{z}/{x}/{y}.{format}")


## Known Issues

- not yet

## Release Notes

### 1.0.0

Initial release of vscode-wsi-viewer.