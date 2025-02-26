"use client"
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function InteractiveMap({position, setPosition}) {
  console.log(position);
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position == null ? null : (
      <Marker position={position}></Marker>
    );
  }

  return (
    <div>
      {/* 32, -80 is in the USA */}
      <MapContainer center={[32, -80]} zoom={2} style={{ height: "200px", width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;
