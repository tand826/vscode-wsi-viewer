# vscode-wsi-viewer

View whole slide images (WSI) in VSCode.
[Extension page](https://marketplace.visualstudio.com/items?itemName=tand826.wsi-viewer)

![](https://raw.githubusercontent.com/tand826/vscode-wsi-viewer/main/images/sample.gif)

## Features

- From right click menu, open a WSI file in a new tab.
- Supported extensions are the ones in [openslide](https://openslide.org/#about-openslide)
  - "svs", "tif", "vms", "vmu", "ndpi", "scn", "mrxs", "tiff", "svslide", "bif"

## Requirements

This extension needs wsiserver for patcing and serving WSI files.

- Install python>=3.6 and [wsiserver](https://github.com/tand826/wsiserver).
  - `apt install openslide-tools`
  - `pip install wsiserver`

If you want to open a WSI in a remote host, you need to

- install wsiserver in the remote host.
- set port forwarding to the host. wsiserver runs on port 31791 by default. If 31791 is occupied by other process, wsi-viewer will try to use 31792, 31793, 31794, 31795.
  - e.g. If you are opening the WSI in "remoteHostA" which is in your local network and has 192.168.50.10, in ssh config file,
    ```
    Host remoteHostA
        HostName 192.168.50.10
        User tand826
        LocalForward 31791 localhost:31791
        LocalForward 31792 localhost:31792
        LocalForward 31793 localhost:31793
        LocalForward 31794 localhost:31794
        LocalForward 31795 localhost:31795
    ```

## Extension Settings

- Available settings
  - wsiviewer.ports (default: 31791,31792,31793,31794,31795)
  - [TO BE ADDED] wsiviewer.url_template (default: "/{url}:{port}/{z}/{x}/{y}.{format}")

## Known Issues

- not yet

## Release Notes

### 1.0.0

Initial release of vscode-wsi-viewer.

### 1.1.0

Enabled for remote servers.

### 1.1.1

Error message updated for wsiserver path.

### 1.1.3

README updated with new sample images.

### 1.1.4

User can open multiple wsis at a time with portforwarding settings.

### 1.1.5

Code visibility changed to public with some new instructions in README.

### 1.1.7

README updated with an animated gif.

### 1.1.8

Security update.
