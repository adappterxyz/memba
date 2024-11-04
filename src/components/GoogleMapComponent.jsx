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


const GoogleMapComponent = ({ lat, lng, onLocationSelect }) => {
  const [center, setCenter] = useState({ lat: lat, lng: lng });
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null); // Ref to store map instance

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
        // Fetch address using Geocoder
        fetchAddress(newCenter, (address) => {
          onLocationSelect(newCenter, address);
        });
      } else {
        console.error("Returned place contains no geometry");
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  // Function to use Geocoder to fetch address
  const fetchAddress = (location, callback) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        console.log(results[0]);
        callback(results[0].formatted_address);
      } else {
        console.error('Geocoder failed due to: ' + status);
        console.log(results[0]);
        callback(null); // Return null if no address found
      }
    });
  };

  const handleMapClick = (e) => {
    const newCenter = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setCenter(newCenter);
    // Fetch address using Geocoder
    fetchAddress(newCenter, (address) => {
      onLocationSelect(newCenter, address);
    });
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
        onClick={handleMapClick}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
