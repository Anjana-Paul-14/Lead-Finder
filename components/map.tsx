'use client'
import { useEffect, useState } from 'react';
import {LoadScript, GoogleMap, Marker} from '@react-google-maps/api'
import { Command, CommandDialog , CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator} from '@/registry/new-york-v4/ui/command';
import { Button } from '@/registry/new-york-v4/ui/button';



const containerStyle = {
    width: "100%",
    height: "60vh",
  };
  
//   const center = {
//     lat: 37.7749, 
//     lng: -122.4194, 
//   };

export const Map = () => {

    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState();

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
    <div className='flex flex-col items-center w-full h-full border-4 border-amber-300'>
    {/* <> */}
    <div className='w-full flex justify-center pt-4'>
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
    </div>

    <div className='flex flex-row items-center py-8'>
        <div className='w-100 '>
        <Command>
        <CommandInput placeholder="Type a command or search..." />
        {/* <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
        </CommandList> */}
        </Command>
        </div>
<div className='pl-4'>
    <Button>
Search
    </Button>
</div>
    </div>
    {/* </> */}
     </div>
  )
}
