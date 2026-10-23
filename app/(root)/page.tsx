import React from 'react'
import HeroSection from '@/components/HeroSection'
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import {getAllBooks} from "@/lib/actions/book.actions";

export const dynamic = 'force-dynamic';

const Page = async ({searchParams}: PageProps<"/">) => {
    const {query} = await searchParams;
    const search = typeof query === 'string' ? query.trim() : '';

    // Empty search returns all books
    const bookResults = await getAllBooks(search || undefined);
    const books = bookResults.success ? bookResults.data ?? [] : [];

    return (
        <main className="wrapper container">
            <HeroSection/>

            <div className="library-filter-bar">
                <h2 className="section-title">Recent Books</h2>
                <SearchBar initialQuery={search}/>
            </div>

            {books.length > 0 ? (
                <div className="library-books-grid">
                    {books.map((book) => (
                        <BookCard
                            key={book._id}
                            title={book.title}
                            author={book.author}
                            coverURL={book.coverURL}
                            slug={book.slug}
                        />
                    ))}
                </div>
            ) : (
                <div className="library-empty-card text-center">
                    <p className="subtitle">
                        {search ? `No books match "${search}".` : 'No books yet. Add one to get started.'}
                    </p>
                </div>
            )}
        </main>
    )
}
export default Page
