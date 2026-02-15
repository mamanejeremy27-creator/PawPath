import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icons not loading from node_modules
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RED_ICON = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const ORANGE_ICON = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

/**
 * Reusable Leaflet map for the Lost Dog system.
 *
 * Props:
 *  - center: { lat, lng }             — map center
 *  - zoom: number                     — initial zoom (default 14)
 *  - height: number|string            — container height (default 260)
 *  - radiusKm: number|null            — search radius circle (km)
 *  - sightings: [{ lat, lng, label, time, notes, photoUrl }]
 *  - originLabel: string              — popup text for center pin
 *  - interactive: boolean             — allow pan/zoom (default true)
 *  - tappable: boolean                — fire onTap(latlng) on click (default false)
 *  - onTap: (latlng) => void
 *  - markerPosition: { lat, lng }     — draggable marker position (for report form)
 *  - fitAll: boolean                  — auto-zoom to fit all markers (default false)
 */
export default function LostDogMap({
  center, zoom = 14, height = 260, radiusKm, sightings = [],
  originLabel = "Last Known", interactive = true, tappable = false,
  onTap, markerPosition, fitAll = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center?.lat || 0, center?.lng || 0],
      zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Small attribution in corner
    L.control.attribution({ prefix: false, position: "bottomright" })
      .addAttribution('<a href="https://openstreetmap.org">OSM</a>')
      .addTo(map);

    if (interactive) {
      L.control.zoom({ position: "topright" }).addTo(map);
    }

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle tap-to-set-location
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tappable) return;

    const handler = (e) => {
      onTap?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on("click", handler);
    return () => map.off("click", handler);
  }, [tappable, onTap]);

  // Update markers/overlays when data changes
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (!center?.lat || !center?.lng) return;

    // Search radius circle
    if (radiusKm) {
      L.circle([center.lat, center.lng], {
        radius: radiusKm * 1000,
        color: "#EF4444",
        fillColor: "#EF4444",
        fillOpacity: 0.06,
        weight: 1.5,
        dashArray: "6 4",
      }).addTo(layer);
    }

    // Origin marker
    const originMarker = L.marker([center.lat, center.lng], { icon: RED_ICON }).addTo(layer);
    originMarker.bindPopup(`<b style="color:#EF4444">${originLabel}</b>`);

    // Sighting markers + trail
    if (sightings.length > 0) {
      const trailCoords = [[center.lat, center.lng]];

      sightings.forEach((s, i) => {
        if (!s.lat || !s.lng) return;
        trailCoords.push([s.lat, s.lng]);

        const marker = L.marker([s.lat, s.lng], { icon: ORANGE_ICON }).addTo(layer);

        let popupHtml = `<div style="min-width:140px">`;
        popupHtml += `<b style="color:#F59E0B">#${i + 1}</b>`;
        if (s.time) {
          const d = new Date(s.time);
          popupHtml += `<br><span style="font-size:11px;color:#666">${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>`;
        }
        if (s.notes) popupHtml += `<br><span style="font-size:12px">${s.notes}</span>`;
        if (s.photoUrl) popupHtml += `<br><img src="${s.photoUrl}" style="width:100%;max-width:160px;border-radius:6px;margin-top:4px" />`;
        popupHtml += `</div>`;
        marker.bindPopup(popupHtml);
      });

      // Movement trail polyline
      L.polyline(trailCoords, {
        color: "#EF4444",
        weight: 2.5,
        opacity: 0.5,
        dashArray: "8 6",
      }).addTo(layer);
    }

    // Draggable marker for report form
    if (markerPosition?.lat && markerPosition?.lng) {
      L.marker([markerPosition.lat, markerPosition.lng], { icon: RED_ICON }).addTo(layer);
    }

    // Fit bounds to show all markers
    if (fitAll && sightings.length > 0) {
      const allPts = [[center.lat, center.lng], ...sightings.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng])];
      if (allPts.length > 1) {
        map.fitBounds(L.latLngBounds(allPts).pad(0.15));
      }
    } else {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, radiusKm, sightings, originLabel, markerPosition, fitAll]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        borderRadius: 16,
        overflow: "hidden",
        background: "#1a1a2e",
      }}
    />
  );
}
