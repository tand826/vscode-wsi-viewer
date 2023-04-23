const url = "http://0.0.0.0";

let view;

const getProps = async (port) => {
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch(`${url}:${port}/props`);
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to get props. Please check the server.");
};

const resetBounds = (zoom2size) => {
  const zoom = view.getZoom();
  const slideSize = zoom2size[zoom];
  const viewSize = view.getSize();
  const topleft = view.unproject(L.point(Number((-viewSize.x / 4) * 3), Number((-viewSize.y / 4) * 3)), zoom);
  const rightbottom = view.unproject(
    L.point(Number(slideSize.x + (viewSize.x / 4) * 3), Number(slideSize.y + (viewSize.y / 4) * 3)),
    zoom
  );
  view.setMaxBounds([topleft, rightbottom]);
};

const getCenter = (zoom2size) => {
  const zoom = view.getZoom();
  const slideSize = zoom2size[zoom];
  return view.unproject(L.point(Number(slideSize.x / 2), Number(slideSize.y / 2)), zoom);
};

const initview = async () => {
  const port = document.title;
  const props = await getProps(port);
  view = L.map("viewer", {
    center: [0, 0],
    zoom: props.default_zoom,
    crs: L.CRS.Simple,
    tileSize: props.tile_size,
  });
  L.tileLayer(`${url}:${port}/tile/{z}/{x}/{y}`).addTo(view);

  view.on("zoomend", (e) => {
    resetBounds(props.zoom2size);
  });

  view.setMinZoom(props.min_zoom);
  view.setMaxZoom(props.max_zoom);
  view.setView(getCenter(props.zoom2size));
};

initview();
