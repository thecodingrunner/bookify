"use client";

import React, { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { Messages } from "@/types";

interface TranscriptProps {
  messages?: Messages[];
  currentMessage?: string;
  currentUserMessage?: string;
}

const Transcript = ({
  messages = [],
  currentMessage = "",
  currentUserMessage = "",
}: TranscriptProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMessage, currentUserMessage]);

  const hasMessages =
    messages.length > 0 ||
    Boolean(currentMessage) ||
    Boolean(currentUserMessage);

  return (
    <div className="transcript-container">
      {!hasMessages ? (
        <div className="transcript-empty">
          <Mic className="size-12 text-[#212a3b] mb-4" />
          <h2 className="transcript-empty-text">No conversation yet</h2>
          <p className="transcript-empty-hint">
            Click the mic button above to start talking
          </p>
        </div>
      ) : (
        <div className="transcript-messages">
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={index}
                className={`transcript-message ${
                  isUser
                    ? "transcript-message-user"
                    : "transcript-message-assistant"
                }`}
              >
                <div
                  className={`transcript-bubble ${
                    isUser
                      ? "transcript-bubble-user"
                      : "transcript-bubble-assistant"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {currentUserMessage && (
            <div className="transcript-message transcript-message-user">
              <div className="transcript-bubble transcript-bubble-user">
                {currentUserMessage}
                <span className="transcript-cursor" />
              </div>
            </div>
          )}

          {currentMessage && (
            <div className="transcript-message transcript-message-assistant">
              <div className="transcript-bubble transcript-bubble-assistant">
                {currentMessage}
                <span className="transcript-cursor" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default Transcript;
