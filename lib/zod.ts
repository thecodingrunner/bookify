import { z } from 'zod';
import {
    ACCEPTED_IMAGE_TYPES,
    ACCEPTED_PDF_TYPES,
    MAX_FILE_SIZE,
    MAX_IMAGE_SIZE,
} from './constants';

export const UploadSchema = z.object({
    pdfFile: z
        .custom<File | null>((file) => (typeof window !== 'undefined' ? file instanceof File : Boolean(file)), {
            message: 'PDF file is required',
        })
        .refine(
            (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
            'PDF file must be less than 50MB'
        )
        .refine(
            (file) => file instanceof File && ACCEPTED_PDF_TYPES.includes(file.type),
            'Only PDF files are accepted'
        ),
    coverImage: z
        .custom<File | null | undefined>()
        .refine(
            (file) => !file || (file instanceof File && file.size <= MAX_IMAGE_SIZE),
            'Image file must be less than 10MB'
        )
        .refine(
            (file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
            'Only JPEG, PNG, or WebP images are accepted'
        )
        .optional()
        .nullable(),
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author Name is required'),
    voice: z.string().min(1, 'Assistant voice is required'),
});

export type UploadSchemaType = z.infer<typeof UploadSchema>;
