'use client'
import { useEffect, useState } from 'react';
import {LoadScript, GoogleMap, Marker} from '@react-google-maps/api'


const containerStyle = {
    width: "100%",
    height: "80%",
  };
  
//   const center = {
//     lat: 37.7749, 
//     lng: -122.4194, 
//   };

export const Map = () => {

    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>

        {currentLocation ? (
        <GoogleMap mapContainerStyle={containerStyle} center={currentLocation} zoom={10}>
            <Marker position={currentLocation}/>
        </GoogleMap>
        ):(
            <p>Loading map...</p>
        )
        }
    </LoadScript>
  )
}
