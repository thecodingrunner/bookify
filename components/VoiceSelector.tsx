"use client";

import React from "react";
import { VoiceSelectorProps } from "@/types";
import { voiceCategories, voiceOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";

const VoiceSelector = ({
    disabled,
    className,
    value,
    onChange,
}: VoiceSelectorProps) => {
    return (
        <div className={cn("space-y-4", className)}>
            {/* Male Voices Group */}
            <div className="space-y-2">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">
                    Male Voices
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {voiceCategories.male.map((key) => {
                        const voice = voiceOptions[key as keyof typeof voiceOptions];
                        const isSelected =
                            value === key ||
                            value === voice.id ||
                            value?.toLowerCase() === voice.name.toLowerCase();

                        return (
                            <div
                                key={key}
                                onClick={() => {
                                    if (!disabled) {
                                        onChange(key);
                                    }
                                }}
                                className={cn(
                                    "voice-selector-option flex items-start gap-3 p-3.5 text-left",
                                    isSelected
                                        ? "voice-selector-option-selected ring-2 ring-[#8B7355]"
                                        : "voice-selector-option-default",
                                    disabled && "voice-selector-option-disabled"
                                )}
                            >
                                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#8B7355]">
                                    {isSelected && (
                                        <div className="h-2 w-2 rounded-full bg-[#663820]" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-[#212a3b]">
                                        {voice.name}
                                    </div>
                                    <div className="text-xs text-[#666] leading-snug mt-0.5">
                                        {voice.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Female Voices Group */}
            <div className="space-y-2">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">
                    Female Voices
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {voiceCategories.female.map((key) => {
                        const voice = voiceOptions[key as keyof typeof voiceOptions];
                        const isSelected =
                            value === key ||
                            value === voice.id ||
                            value?.toLowerCase() === voice.name.toLowerCase();

                        return (
                            <div
                                key={key}
                                onClick={() => {
                                    if (!disabled) {
                                        onChange(key);
                                    }
                                }}
                                className={cn(
                                    "voice-selector-option flex items-start gap-3 p-3.5 text-left",
                                    isSelected
                                        ? "voice-selector-option-selected ring-2 ring-[#8B7355]"
                                        : "voice-selector-option-default",
                                    disabled && "voice-selector-option-disabled"
                                )}
                            >
                                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#8B7355]">
                                    {isSelected && (
                                        <div className="h-2 w-2 rounded-full bg-[#663820]" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-[#212a3b]">
                                        {voice.name}
                                    </div>
                                    <div className="text-xs text-[#666] leading-snug mt-0.5">
                                        {voice.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VoiceSelector;
