'use client'
import React,{ useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { Place } from '@/types/place';



export const SavedList = () => {
    // const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
    const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedPlaces = async () => {
      try {
        const response = await fetch('/api/user/saved-places');
        
        if (response.status === 401) {
          setError('Please log in to view saved places');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        
        const data = await response.json();
        setSavedPlaces(data.savedPlaces || []);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load saved places. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPlaces();
  }, []);

   if (loading) {
    return <div className="flex justify-center items-center h-60vh">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-60vh text-red-500">{error}</div>;
  }


  return (
         <div className="flex flex-col items-center w-full h-full px-4">
      <h1 className="text-xl font-bold my-4">Saved Lists</h1>
      <div className="w-full px-4 overflow-x-auto">
        <div className="w-[400px] sm:w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Website</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedPlaces.length > 0 ? (
                savedPlaces.map((place) => (
                  <TableRow key={place.place_id}>
                    <TableCell>{place.name}</TableCell>
                    <TableCell>{place.vicinity}</TableCell>
                    <TableCell>{place.rating || 'N/A'}</TableCell>
                    <TableCell>
                      {place.website ? (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No saved places found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
