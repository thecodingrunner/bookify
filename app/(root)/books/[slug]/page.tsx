import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";

// export const instant = false;

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

  return (
    <main className="book-page-container">
      <Link href="/" className="back-btn-floating" aria-label="Back to home">
        <ArrowLeft className="size-5 text-[#212a3b]" />
      </Link>

      <VapiControls book={book} />
    </main>
  );
};

export default BookDetailsPage;
