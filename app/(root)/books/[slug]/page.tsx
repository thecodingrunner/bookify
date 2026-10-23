import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/book.actions";

interface BookDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const BookDetailsPage = async ({ params }: BookDetailsPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { slug } = await params;
  const bookResult = await getBookBySlug(slug);

  if (!bookResult.success || !bookResult.data) {
    redirect("/");
  }

  const book = bookResult.data;
  const persona = book.persona
    ? book.persona.charAt(0).toUpperCase() + book.persona.slice(1)
    : "Daniel";

  return (
    <main className="book-page-container">
      <Link href="/" className="back-btn-floating" aria-label="Back to home">
        <ArrowLeft className="size-5 text-[#212a3b]" />
      </Link>

      <div className="max-w-4xl mx-auto flex flex-col gap-6 w-full">
        {/* Header Card */}
        <section className="vapi-header-card">
          <div className="relative shrink-0">
            <Image
              src={book.coverURL}
              alt={book.title}
              width={120}
              height={180}
              className="w-[120px] h-auto rounded-lg object-cover shadow-[0px_10px_30px_0px_rgba(0,0,0,0.1)]"
            />
            <div className="absolute -bottom-2 -right-2">
              <button
                type="button"
                className="vapi-mic-btn shadow-md"
                aria-label="Toggle microphone"
              >
                <MicOff className="size-6 text-[#212a3b]" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#212a3b]">
              {book.title}
            </h1>
            <p className="text-sm sm:text-base text-[#3d485e]">
              by {book.author}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="vapi-status-indicator">
                <span className="vapi-status-dot vapi-status-dot-ready" />
                <span className="vapi-status-text">Ready</span>
              </div>
              <div className="vapi-status-indicator">
                <span className="vapi-status-text">
                  Voice: <span className="font-semibold">{persona}</span>
                </span>
              </div>
              <div className="vapi-status-indicator">
                <span className="vapi-status-text font-semibold">
                  0:00/15:00
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Transcript Area */}
        <section className="transcript-container min-h-[400px] flex items-center justify-center p-6">
          <div className="transcript-empty">
            <Mic className="size-12 text-[#212a3b] mb-4" />
            <h2 className="transcript-empty-text">No conversation yet</h2>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BookDetailsPage;
