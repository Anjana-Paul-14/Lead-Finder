'use client'

import {LoadScript, GoogleMap, Marker} from '@react-google-maps/api'


const containerStyle = {
    width: "100%",
    height: "400px",
  };
  
  const center = {
    lat: 37.7749, 
    lng: -122.4194, 
  };

export const Map = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
        
    </LoadScript>
  )
}
