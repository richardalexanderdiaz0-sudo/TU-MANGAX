import { useState, useEffect } from 'react';

export function useUserLocation() {
  const [location, setLocation] = useState<{country_code: string, currency: string} | null>(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setLocation({country_code: data.country_code, currency: data.currency}))
      .catch(() => setLocation({country_code: 'US', currency: 'USD'})); // Fallback to USD
  }, []);

  return location;
}
