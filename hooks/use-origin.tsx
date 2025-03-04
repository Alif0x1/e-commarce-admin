import  { useState, useEffect } from 'react';

export const UseOrigin = () => {
    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== 'undefined' ? window.location.origin : null;

    useEffect(() => {
        if (typeof window !== 'undefined') {
           
        }
        setMounted(true);
    }, []); // Empty dependency array ensures this runs only once

    if (!mounted) return null;

    return  origin // Return the origin as a JSX element or use it elsewhere
};

