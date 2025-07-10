'use client'

import { useEffect, useState } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { Command, CommandInput } from '@/registry/new-york-v4/ui/command';
import { Button } from '@/registry/new-york-v4/ui/button';
import { useCredits } from '@/components/credit-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/registry/new-york-v4/ui/pagination';
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  const itemsPerPage = 5;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSearch = async () => {
    if (!currentLocation || !searchQuery) return;
    decrementCredits();
    
    if (!isLoaded || !window.google?.maps?.places) {
      console.error("Google Maps Places API not loaded");
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
        const placesWithDetails = results.map(place => getPlaceDetails(place, service));
        Promise.all(placesWithDetails).then(setPlaces);
        setCurrentPage(1);
      }
    });
  };

  const getPlaceDetails = (
    place: google.maps.places.PlaceResult,
    service: google.maps.places.PlacesService
  ): Promise<PlaceDetails> => {
    return new Promise((resolve) => {
      service.getDetails({ placeId: place.place_id! }, (details, status) => {
        resolve({
          name: details?.name || place.name || "Unknown",
          vicinity: details?.vicinity || place.vicinity || "Unknown",
          rating: details?.rating || place.rating || "N/A",
          website: details?.website || "No Website",
          place_id: place.place_id || "",
        });
      });
    });
  };

  const handleSaveAllPlaces = async () => {
    if (!session?.user?.email) {
      alert("Please sign in to save places.");
      return;
    }

    try {
      const res = await fetch('/api/user/save-place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          places: places.map(place => ({
            name: place.name,
            vicinity: place.vicinity,
            place_id: place.place_id
          }))
        }),
      });

      if (res.ok) {
        alert("Places saved successfully!");
      } else {
        const error = await res.text();
        alert(`Failed to save places: ${error}`);
      }
    } catch (error) {
      console.error("Error saving places:", error);
      alert("Error saving places. Please try again.");
    }
  };

  if (loadError) return <p>Error loading maps: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  // Pagination logic
  const totalPages = Math.ceil(places.length / itemsPerPage);
  const paginatedPlaces = places.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col items-center w-full h-full border-4 px-4">
      <div className="w-full h-[60vh] mb-6 rounded-lg overflow-hidden">
        {currentLocation ? (
          <GoogleMap 
            mapContainerStyle={containerStyle} 
            center={currentLocation} 
            zoom={10}
          >
            <Marker position={currentLocation} />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-4 mb-6">
        <div className="w-full sm:w-3/4 md:w-2/3">
          <Command>
            <CommandInput
              placeholder="Search for places..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </Command>
        </div>
        <Button onClick={handleSearch} className="w-full sm:w-auto">
          Search
        </Button>
      </div>

      {places.length > 0 && (
        <div className="w-full px-4 overflow-x-auto">
          <div className="w-[400px] sm:w-full">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Website</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPlaces.map((place) => (
                  <TableRow key={place.place_id}>
                    <TableCell className="font-medium">{place.name}</TableCell>
                    <TableCell>{place.vicinity}</TableCell>
                    <TableCell>{place.rating}</TableCell>
                    <TableCell>
                      {place.website !== 'No Website' ? (
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Visit
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

          <div className="flex justify-end w-full mt-4">
            <Button onClick={handleSaveAllPlaces}>
              Save All Places
            </Button>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};