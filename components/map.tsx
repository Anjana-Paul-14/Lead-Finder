'use client'

import { useEffect, useState } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { Command, CommandInput } from '@/registry/new-york-v4/ui/command';
import { Button } from '@/registry/new-york-v4/ui/button';
import { useCredits } from '@/components/credit-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/registry/new-york-v4/ui/pagination';

const containerStyle = {
  width: "100%",
  height: "60vh",
};

const libraries: ("places")[] = ["places"];

interface PlaceDetails {
  name: string;
  vicinity: string;
  rating: number | string;
  website: string;
  place_id: string;
}

export const Map = () => {
  const { decrementCredits } = useCredits();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [places, setPlaces] = useState<PlaceDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);



  const itemsPerPage = 5;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries,
  });

  console.log("isLoaded:", isLoaded, "loadError:", loadError);
  
  useEffect(() => {
    console.log("Checking geolocation...");
  if (!navigator.geolocation) {
    console.error("Geolocation not supported");
    return;
  }

navigator.geolocation.getCurrentPosition(
  (position) => {
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    console.log("Current location:", coords);
    setCurrentLocation(coords);
  },
  (error) => {
    console.error("Geolocation error:", error);
  },
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
);
}, []);


  const handleSearch = async () => {
    if (!currentLocation || !searchQuery) return;
    decrementCredits();
    if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps Places API is not loaded yet.");
      return;
    }

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
      radius: 5000,
      keyword: searchQuery,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const placesWithDetails = results.map((place) => getPlaceDetails(place, service));
        Promise.all(placesWithDetails).then(setPlaces);
        setCurrentPage(1);
      } else {
        console.error("Error fetching places:", status);
      }
    });
  };

  const getPlaceDetails = (
    place: google.maps.places.PlaceResult,
    service: google.maps.places.PlacesService
  ): Promise<PlaceDetails> => {
    return new Promise((resolve) => {
      service.getDetails({ placeId: place.place_id! }, (details, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && details) {
          resolve({
            name: details.name ?? "Unknown",
            vicinity: details.vicinity ?? "Unknown",
            rating: details.rating ?? "N/A",
            website: details.website ?? "No Website",
            place_id: details.place_id ?? "",
          });
        } else {
          resolve({
            name: place.name ?? "Unknown",
            vicinity: place.vicinity ?? "Unknown",
            rating: place.rating ?? "N/A",
            website: "No Website",
            place_id: place.place_id ?? "",
          });
        }
      });
    });
  };

  if (loadError) return <p>Error loading maps: {loadError.message}</p>;
  if (!isLoaded) {
    return <p>Loading maps...</p>;
  }
const totalPages = Math.ceil(places.length / itemsPerPage);
  const paginatedPlaces = places.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

const handleSaveAllPlaces = async () => {
  try {
    const res = await fetch('/api/user/save-place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ places }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to save places:", data.message);
      return;
    }

    console.log("Places saved successfully");
  } catch (err) {
    console.error("Failed to save places:", err);
  }
};



  return (
    <div className="flex flex-col items-center w-full h-full border-4 px-4 ">
      <div className="w-full h-[60vh] mb-6 rounded-lg overflow-hidden min-h-[300px]">
        {currentLocation ? (
          <GoogleMap mapContainerStyle={containerStyle} center={currentLocation} zoom={10} onLoad={() => console.log("Google Map rendered successfully")}>
            <Marker position={currentLocation} />
          </GoogleMap>
        ) : (
          <p>Loading mappppp...</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-4 mb-6">
        <div className="w-full sm:w-3/4 md:w-2/3">
          <Command>
            <CommandInput
              placeholder="Type a command or search..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </Command>
        </div>
        <div className="pl-4">
          <Button onClick={handleSearch} className="w-full sm:w-auto">Search</Button>
        </div> 
      </div>

      {places.length > 0 &&  (
        <div className="w-full px-4 overflow-x-auto">
           <div className="w-[400px] sm:w-full">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Website Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlaces.map((place) => (
                <TableRow key={place.place_id}>
                  <TableCell>{place.name}</TableCell>
                  <TableCell>{place.vicinity}</TableCell>
                  <TableCell>{place.rating}</TableCell>
                  <TableCell>
                    {place.website !== 'No Website' ? (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Visit Website
                      </a>
                    ) : (
                      'No Website'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
<div className="flex justify-end w-full mt-2 pr-6">
    <Button onClick={handleSaveAllPlaces}>
      Save All Places
    </Button>
  </div>
          {/* Pagination Section */}
          <Pagination className="mt-4">
            <PaginationContent className="flex-wrap justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === index + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
