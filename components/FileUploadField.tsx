"use client";

import React, { useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { X } from "lucide-react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FileUploadFieldProps } from "@/types";
import { cn } from "@/lib/utils";

const FileUploadField = <T extends FieldValues>({
    control,
    name,
    label,
    acceptTypes,
    disabled,
    icon: Icon,
    placeholder,
    hint,
}: FileUploadFieldProps<T>) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const file =
                    field.value && typeof field.value === "object" && "name" in field.value
                        ? (field.value as unknown as File)
                        : null;

                const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                        field.onChange(selectedFile);
                    }
                };

                const handleRemove = () => {
                    field.onChange(null);
                    if (inputRef.current) {
                        inputRef.current.value = "";
                    }
                };

                const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (disabled) return;

                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) {
                        field.onChange(droppedFile);
                    }
                };

                const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    if (!disabled) {
                        setIsDragging(true);
                    }
                };

                const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    setIsDragging(false);
                };

                return (
                    <FormItem>
                        <FormLabel className="form-label">{label}</FormLabel>
                        <FormControl>
                            <div>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept={acceptTypes.join(",")}
                                    className="hidden"
                                    disabled={disabled}
                                    onChange={handleFileChange}
                                />
                                <div
                                    onClick={() => {
                                        if (!disabled) {
                                            inputRef.current?.click();
                                        }
                                    }}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    className={cn(
                                        "upload-dropzone border-2 border-dashed border-[#8B7355]/30 relative transition-all",
                                        file && "upload-dropzone-uploaded border-[#8B7355]",
                                        isDragging && "border-[#663820] bg-gray-50",
                                        disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <Icon className="upload-dropzone-icon" />

                                    {file ? (
                                        <div className="flex flex-col items-center justify-center space-y-1 max-w-[90%]">
                                            <div className="flex items-center gap-2">
                                                <span className="upload-dropzone-text font-semibold truncate max-w-[280px] sm:max-w-[400px]">
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemove();
                                                    }}
                                                    className="upload-dropzone-remove"
                                                    aria-label="Remove file"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <p className="upload-dropzone-hint text-xs">
                                                Click to change file
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="upload-dropzone-text">{placeholder}</p>
                                            <p className="upload-dropzone-hint">{hint}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};

export default FileUploadField;
