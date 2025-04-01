'use client'
import { useEffect, useState } from 'react';
import {useLoadScript, LoadScript, GoogleMap, Marker} from '@react-google-maps/api'
import { Command, CommandDialog , CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator} from '@/registry/new-york-v4/ui/command';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';


const containerStyle = {
    width: "100%",
    height: "60vh",
  };
  

  const libraries: ("places")[] = ["places"];

//   const center = {
//     lat: 37.7749, 
//     lng: -122.4194, 
//   };

export const Map = () => {

    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [places, setPlaces] = useState<any[]>([]);

    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
      libraries, // Use the constant defined above
    });
  

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

  const handleSearch = async () => {
    if (!currentLocation || !searchQuery) return;

    if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps Places API is not loaded yet.");
      return;
    }

    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    const request = {
      location: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
      radius: 5000, // Search within 5km radius
      keyword: searchQuery,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results);
      }
    });
  };


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
        <CommandInput placeholder="Type a command or search..." 
        value={searchQuery}
        onValueChange={setSearchQuery} />
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
    <Button onClick={handleSearch}>
Search
    </Button>
</div>
    </div>
    {places.length > 0 && (
        <div className="w-full px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rating</TableHead>
                {/* <TableHead>Website Status</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {places.map((place) => (
                <TableRow key={place.place_id}>
                  <TableCell>{place.name}</TableCell>
                  <TableCell>{place.vicinity}</TableCell>
                  <TableCell>{place.rating || "N/A"}</TableCell>
                  {/* <TableCell>{place.website}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
     </div>
  )
}
