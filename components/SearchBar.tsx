"use client";

import React, {useEffect, useState} from 'react'
import {usePathname, useRouter} from "next/navigation";
import {Search} from "lucide-react";

const SEARCH_DEBOUNCE_MS = 300;

// Syncs the query to the URL (?query=...) so results are server-rendered and the search is shareable
const SearchBar = ({initialQuery = ''}: { initialQuery?: string }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery);

    // Debounced URL update. Reads the current params when the timer fires rather than
    // depending on them, so our own router.replace doesn't re-trigger this effect.
    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            const value = query.trim();

            // Skip navigation if the URL already reflects this query (e.g. on mount)
            if ((params.get('query') ?? '') === value) return;

            if (value) {
                params.set('query', value);
            } else {
                params.delete('query');
            }

            const search = params.toString();
            router.replace(search ? `${pathname}?${search}` : pathname, {scroll: false});
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
    }, [query, pathname, router]);

    return (
        <form role="search" className="library-search-wrapper" onSubmit={(e) => e.preventDefault()}>
            <Search className="icon-sm ml-3 text-[var(--text-muted)]" aria-hidden="true"/>
            <input
                type="search"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or author"
                aria-label="Search books by title or author"
                className="library-search-input"
            />
        </form>
    )
}
export default SearchBar
