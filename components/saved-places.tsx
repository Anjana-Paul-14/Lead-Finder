// 'use client';
// import { useEffect, useState } from 'react';

// export default function SavedPlaces() {
//   const [places, setPlaces] = useState([]);

//   useEffect(() => {
//     fetch('/api/user/get-saved-places')
//       .then(res => res.json())
//       .then(data => setPlaces(data.savedPlaces || []));
//   }, []);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Your Saved Places</h2>
//       <ul>
//         {places.map(place => (
//           <li key={place.place_id}>
//             <strong>{place.name}</strong> - {place.vicinity}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// 'use client';

// interface PlaceDetails {
//   name: string;
//   vicinity: string;
//   rating?: number | string;
//   website?: string;
//   place_id: string;
// }

// interface SavedPlacesProps {
//   places: PlaceDetails[];
// }

// export default function SavedPlaces({ places }: SavedPlacesProps) {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Your Saved Places</h2>
//       {places.length > 0 ? (
//         <ul className="space-y-3">
//           {places.map(place => (
//             <li key={place.place_id} className="border p-3 rounded-lg">
//               <strong className="block font-medium">{place.name}</strong>
//               <span className="text-sm text-gray-600">{place.vicinity}</span>
//               {place.website && place.website !== 'No Website' && (
//                 <a 
//                   href={place.website} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="text-blue-600 text-sm block mt-1"
//                 >
//                   Visit Website
//                 </a>
//               )}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500">No saved places yet</p>
//       )}
//     </div>
//   );
// }
'use client'

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';

interface PlaceDetails {
  name: string;
  vicinity: string;
  rating: number | string;
  website: string;
  place_id: string;
}

const SavedPlacesPage = () => {
  const [savedPlaces, setSavedPlaces] = useState<PlaceDetails[]>([]);

  useEffect(() => {
    const fetchSavedPlaces = async () => {
      try {
        const res = await fetch('/api/user/get-saved-places');
        const data = await res.json();
        if (res.ok) {
          setSavedPlaces(data.savedPlaces || []);
        } else {
          console.error("Failed to fetch saved places:", data.error);
        }
      } catch (err) {
        console.error("Error fetching saved places:", err);
      }
    };

    fetchSavedPlaces();
  }, []);

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4">Saved Places</h2>
      {savedPlaces.length === 0 ? (
        <p>No saved places found.</p>
      ) : (
        <div className="overflow-x-auto">
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
              {savedPlaces.map((place) => (
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
      )}
    </div>
  );
};

export default SavedPlacesPage;
