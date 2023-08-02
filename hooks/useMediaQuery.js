import { useState, useEffect } from "react";

const getMatches = (query) => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
    }
    return false;
};


export const maxWidths = {
    mobile: 480,
    tablet: 768,
    laptop: 1024,
    desktop: 1200,
};

/**
 * Returns true if the given media query matches.
 * Returns undefined until the first render occured to prevent hydration errors.
 * @param query A media query as string
 * @returns
 */
export function useMediaQuery(query) {
    const [hasMatch, setHasMatches] = useState(getMatches(query));
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
        }
    }, []);

    function handleChange() {
        setHasMatches(getMatches(query));
    }

    useEffect(() => {
        const matchMedia = window.matchMedia(query);
        handleChange();
        matchMedia.addEventListener('change', handleChange);
        return () => {
            matchMedia.removeEventListener('change', handleChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return initialLoad ? undefined : hasMatch;
}