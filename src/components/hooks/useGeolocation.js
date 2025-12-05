'use client';

import { useState, useEffect } from 'react';

export function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
        };

        const handleError = (error) => {
            setError(error.message);
        };

        const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watcher);
    }, []);

    return { location, error };
}
