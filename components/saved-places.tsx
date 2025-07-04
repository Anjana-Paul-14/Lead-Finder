'use client';
import { useEffect, useState } from 'react';

export default function SavedPlaces() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch('/api/user/get-saved-places')
      .then(res => res.json())
      .then(data => setPlaces(data.savedPlaces || []));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Saved Places</h2>
      <ul>
        {places.map(place => (
          <li key={place.place_id}>
            <strong>{place.name}</strong> - {place.vicinity}
          </li>
        ))}
      </ul>
    </div>
  );
}
