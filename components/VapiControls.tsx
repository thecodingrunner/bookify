"use client"

import useVapi from "@/hooks/useVapi";
import {IBook} from "@/types";
import React from "react";
import Image from "next/image";
import {Mic, MicOff} from "lucide-react";
import Transcript from "@/components/Transcript";
import {formatDuration} from "@/lib/utils";

const VapiControls = ({book}: { book: IBook }) => {
    const {status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, persona} =
        useVapi(book);

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6 w-full">
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
                        {isActive && (status === "speaking" || status === "thinking") && (
                            <span className="vapi-pulse-ring" />
                        )}
                        <button
                            onClick={isActive ? stop : start}
                            disabled={status === "connecting"}
                            type="button"
                            className="vapi-mic-btn shadow-md"
                            aria-label="Toggle microphone"
                        >
                            {isActive ? (
                                <Mic className="size-6 text-[#212a3b]"/>
                            ) : (
                                <MicOff className="size-6 text-[#212a3b]"/>
                            )}
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
                            <span className="vapi-status-dot vapi-status-dot-ready"/>
                            <span className="vapi-status-text">Ready</span>
                        </div>
                        <div className="vapi-status-indicator">
                            <span className="vapi-status-text">
                              Voice: <span className="font-semibold">{persona}</span>
                            </span>
                        </div>
                        <div className="vapi-status-indicator">
                            <span className="vapi-status-text font-semibold">
                                {formatDuration(duration)}/15:00
                            </span>
                        </div>
                    </div>
                </div>
            </section>
            <div className="vapi-transcript-wrapper">
                <Transcript
                    messages={messages}
                    currentMessage={currentMessage}
                    currentUserMessage={currentUserMessage}
                />
            </div>
        </div>
    )
}
export default VapiControls
