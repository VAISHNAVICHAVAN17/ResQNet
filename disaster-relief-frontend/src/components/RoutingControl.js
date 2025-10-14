import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap, Marker, Tooltip } from "react-leaflet";

// [ ... marker code omitted, kept as previous ... ]

export default function RoutingControl({ providerLat, providerLng, ngoLat, ngoLng }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !providerLat || !providerLng || !ngoLat || !ngoLng) return;

    let routingControl = null;

    // Monkey-patch removeLayer inside routing machine to no-op if null!
    const patchRemoveLayer = () => {
      const orig = L.LayerGroup.prototype.removeLayer;
      L.LayerGroup.prototype.removeLayer = function (layer) {
        if (!this._map || !layer) return this;
        try {
          return orig.call(this, layer);
        } catch (e) {
          // Swallow any error silently
          return this;
        }
      };
      return () => { L.LayerGroup.prototype.removeLayer = orig; };
    };
    const unpatch = patchRemoveLayer();

    try {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(providerLat, providerLng),
          L.latLng(ngoLat, ngoLng)
        ],
        createMarker: () => null,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        routeWhileDragging: false,
        lineOptions: { styles: [{ color: "blue", weight: 5 }] },
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          timeout: 30 * 1000
        })
      }).addTo(map);

      setTimeout(() => {
        const instrPanel = document.querySelectorAll('.leaflet-routing-container');
        instrPanel.forEach(pane => pane && (pane.style.display = "none"));
      }, 100);
    } catch (err) {
      routingControl = null;
    }

    return () => {
      try {
        if (routingControl && typeof routingControl.remove === "function") {
          routingControl.remove();
        } else if (map && typeof map.removeControl === "function" && routingControl) {
          map.removeControl(routingControl);
        }
      } catch (err) {}
      unpatch && unpatch(); // restore original method
    };
  }, [map, providerLat, providerLng, ngoLat, ngoLng]);

  return (
    <>
      <Marker position={[providerLat, providerLng]}>
        <Tooltip direction="top" offset={[0, -16]} permanent={false}>Source</Tooltip>
      </Marker>
      <Marker position={[ngoLat, ngoLng]}>
        <Tooltip direction="top" offset={[0, -16]} permanent={false}>Destination</Tooltip>
      </Marker>
    </>
  );
}
