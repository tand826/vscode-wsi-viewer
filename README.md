# vscode-wsi-viewer README

View whole slide images (WSI) in VSCode.
[Extension page](https://marketplace.visualstudio.com/items?itemName=tand826.wsi-viewer)

![](https://github.com/tand826/vscode-wsi-viewer/blob/main/images/sample.gif)

## Features

- From right click menu, open a WSI file in a new tab.
- Supported extensions are the ones in [openslide](https://openslide.org/#about-openslide)
  - "svs", "tif", "vms", "vmu", "ndpi", "scn", "mrxs", "tiff", "svslide", "bif"

## Requirements

This extension needs wsiserver for patcing and serving WSI files.

- Install python>=3.6 and [wsiserver](https://github.com/tand826/wsiserver).
  - `pip install wsiserver`

If you want to open a WSI in a remote host, you need to

- install wsiserver in the remote host.
- set port forwarding to the host. wsiserver runs on port 31791 by default. So you need to close a WSI tab before opening another WSI.
  - e.g. If you are opening the WSI in "remoteHostA" which is in your local network and has 192.168.50.10, in ssh config file,
    ```
    Host remoteHostA
        HostName 192.168.50.10
        User tand826
        LocalForward 31791 192.168.50.10:31791
        # LocalForward 31792 192.168.50.10:31792
    ```

## Extension Settings

- Available settings
  - TO BE ADDED
    - wsiviewer.url_template (default: "/{url}:{port}/{z}/{x}/{y}.{format}")
    - wsiviewer.ports (default: 31791,31792)

## Known Issues

- not yet

## Release Notes

### 1.0.0

Initial release of vscode-wsi-viewer.
