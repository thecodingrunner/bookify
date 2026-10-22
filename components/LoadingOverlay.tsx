"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    title?: string;
    message?: string;
}

const LoadingOverlay = ({
    title = "Synthesizing Book...",
    message = "Uploading files and generating interactive session...",
}: LoadingOverlayProps) => {
    return (
        <div className="loading-wrapper">
            <div className="loading-shadow-wrapper bg-[#fbf7ee] shadow-2xl border border-[var(--border-subtle)]">
                <div className="loading-shadow">
                    <Loader2 className="loading-animation w-12 h-12 text-[#663820]" />
                    <h2 className="loading-title font-serif">{title}</h2>
                    <div className="loading-progress">
                        <div className="loading-progress-item">
                            <span className="loading-progress-status" />
                            <span className="text-[var(--text-secondary)] font-medium">
                                {message}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
