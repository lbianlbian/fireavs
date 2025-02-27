"use client"
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function InteractiveMap({position, setPosition}) {
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });
    let nullCheck = position == null || position.lat == null || position.lng == null;
    let badNums = position == null || isNaN(position.lat) || isNaN(position.lng);
    return nullCheck || badNums ? null : (
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
