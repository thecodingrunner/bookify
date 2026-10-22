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

interface UploadFormProps {
    onSubmitAction?: (values: BookUploadFormValues) => Promise<void> | void;
}

const UploadForm = ({ onSubmitAction }: UploadFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<BookUploadFormValues>({
        resolver: zodResolver(UploadSchema),
        defaultValues: {
            pdfFile: null,
            coverImage: null,
            title: "",
            author: "",
            voice: DEFAULT_VOICE,
        },
    });

    const onSubmit = async (values: BookUploadFormValues) => {
        try {
            setIsSubmitting(true);
            if (onSubmitAction) {
                await onSubmitAction(values);
            } else {
                // Default placeholder behavior for form submission
                await new Promise((resolve) => setTimeout(resolve, 1500));
            }
        } catch (error) {
            console.error("Failed to submit form:", error);
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
                        name="voice"
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
