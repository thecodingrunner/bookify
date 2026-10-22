"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ImageIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import FileUploadField from "@/components/FileUploadField";
import VoiceSelector from "@/components/VoiceSelector";
import LoadingOverlay from "@/components/LoadingOverlay";
import { UploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import {
    ACCEPTED_IMAGE_TYPES,
    ACCEPTED_PDF_TYPES,
    DEFAULT_VOICE,
} from "@/lib/constants";
import {useAuth} from "@clerk/nextjs";
import { toast } from "sonner";
import {checkBookExists, createBook, saveBookSegments} from "@/lib/actions/book.actions";
import {useRouter} from "next/navigation";
import {parsePDFFile} from "@/lib/utils";
import {upload} from "@vercel/blob/client";

interface UploadFormProps {
    onSubmitAction?: (values: BookUploadFormValues) => Promise<void> | void;
}

const UploadForm = ({ onSubmitAction }: UploadFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userId } = useAuth();
    const router = useRouter();

    const form = useForm<BookUploadFormValues>({
        resolver: zodResolver(UploadSchema),
        defaultValues: {
            title: "",
            author: "",
            persona: "",
            pdfFile: undefined,
            coverImage: undefined,
        },
    });

    const onSubmit = async (data: BookUploadFormValues) => {
        if (!userId) {
            return toast.error("User not authenticated");
        }

        setIsSubmitting(true);

        // PostHog -> Track Book Uploads...

        try {
            const existsCheck = await checkBookExists(data.title);

            if (existsCheck.exists && existsCheck.book) {
                toast.info("Book with same title already exists.");
                form.reset();
                router.push(`/books/${existsCheck.book.id}`);
                return;
            }

            const fileTitle = data.title.replace(/\s+/g, "-").toLowerCase();
            const pdfFile = data.pdfFile;

            const parsedPDF = await parsePDFFile(pdfFile);

            if (parsedPDF.content.length === 0) {
                toast.error("Failed to parse PDF. Please try again with a different file.");
                return;
            }

            const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
                access: "public",
                handleUploadUrl: "/api/upload",
                contentType: "application/pdf",
            });

            let coverUrl: string;

            if (data.coverImage) {
                const coverFile = data.coverImage;
                const uploadedCoverBlob = await upload(fileTitle, coverFile, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                    contentType: coverFile.type,
                });
                coverUrl = uploadedCoverBlob.url;
            } else {
                const response = await fetch(parsedPDF.cover);
                const blob = await response.blob();

                const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                    contentType: 'image/png',
                });
                coverUrl = uploadedCoverBlob.url;
            }

            const book = await createBook({
                clerkId: userId,
                title: data.title,
                author: data.author,
                persona: data.persona,
                fileURL: uploadedPdfBlob.url,
                fileBlobKey: uploadedPdfBlob.pathname,
                coverURL: coverUrl,
                fileSize: pdfFile.size,
            });

            if (!book.success) throw new Error("Failed to create book");

            if (book.alreadyExists) {
                toast.info("Book with same title already exists.");
                form.reset();
                router.push(`/books/${existsCheck.book.id}`);
                return;
            }

            const segments = await saveBookSegments(book.data._id, userId, parsedPDF.content);

            if (!segments.success) {
                toast.error("Failed to save book segments");
                throw new Error("Failed to save book segments");
            }

            form.reset();
            router.push('/');
        } catch (error) {
            console.error("Failed to submit form:", error);

            toast.error("Failed to upload book. Please try again later.")
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="new-book-wrapper">
            {isSubmitting && <LoadingOverlay />}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* PDF File Upload */}
                    <FileUploadField
                        control={form.control}
                        name="pdfFile"
                        label="Upload Book PDF"
                        acceptTypes={ACCEPTED_PDF_TYPES}
                        icon={Upload}
                        placeholder="Click to upload PDF"
                        hint="PDF file (max 50MB)"
                        disabled={isSubmitting}
                    />

                    {/* Cover Image Upload */}
                    <FileUploadField
                        control={form.control}
                        name="coverImage"
                        label="Upload Book Cover Image"
                        acceptTypes={ACCEPTED_IMAGE_TYPES}
                        icon={ImageIcon}
                        placeholder="Click to upload cover image"
                        hint="Leave empty to auto-generate from PDF"
                        disabled={isSubmitting}
                    />

                    {/* Title Input */}
                    <InputField
                        control={form.control}
                        name="title"
                        label="Title"
                        placeholder="ex: Rich Dad Poor Dad"
                        disabled={isSubmitting}
                    />

                    {/* Author Input */}
                    <InputField
                        control={form.control}
                        name="author"
                        label="Author Name"
                        placeholder="ex: Robert Kiyosaki"
                        disabled={isSubmitting}
                    />

                    {/* Voice Selector */}
                    <FormField
                        control={form.control}
                        name="persona"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">
                                    Choose Assistant Voice
                                </FormLabel>
                                <FormControl>
                                    <VoiceSelector
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="form-btn"
                    >
                        Begin Synthesis
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UploadForm;
