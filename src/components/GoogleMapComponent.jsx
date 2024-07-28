import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  "z-index": 9999,
  display: "block"
};

const inputStyle = {
  padding: '10px',
  marginBottom: '10px',
  boxSizing: 'border-box',
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: 1,
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

const GoogleMapComponent = ({ lat,lng, onLocationSelect }) => {
    console.log(lat,lng);
  const [center, setCenter] = useState({ lat: lat, lng: lng });
  const autocompleteRef = useRef(null);

  // Initialize the autocomplete and set up the place changed listener
  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete; // Store the autocomplete object in the ref
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']); // Setup fields to fetch from API
    console.log('Autocomplete loaded:', autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      console.log('Place changed:', place);
      if (place.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setCenter(newCenter);
        onLocationSelect(newCenter);
      } else {
        console.error("Returned place contains no geometry");
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search location"
          style={inputStyle}
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={(e) => onLocationSelect({
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        })}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
