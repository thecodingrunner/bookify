"use server";

import {EndSessionResult, SessionCheckResult, StartSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import {getCurrentBillingPeriodStart} from "@/lib/subscription-constants";
import {getUserPlanLimits} from "@/lib/subscription.server";
import {auth} from "@clerk/nextjs/server";

// Counts sessions in the current calendar-month billing period against the user's plan
const checkSessionLimit = async (clerkId: string, billingPeriodStart: Date): Promise<SessionCheckResult> => {
    const { plan, limits } = await getUserPlanLimits();

    const currentCount = await VoiceSession.countDocuments({ clerkId, billingPeriodStart });

    const result = {
        currentCount,
        limit: limits.maxSessionsPerMonth,
        plan,
        maxDurationMinutes: limits.maxSessionMinutes,
    };

    if (currentCount >= limits.maxSessionsPerMonth) {
        return {
            ...result,
            allowed: false,
            error: `You have reached the monthly session limit for your ${plan} plan (${limits.maxSessionsPerMonth}). Please upgrade for more sessions.`,
        };
    }

    return { ...result, allowed: true };
}

export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        const { userId } = await auth();

        if (!userId || userId !== clerkId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        const billingPeriodStart = getCurrentBillingPeriodStart();

        // Check plan limits to see whether a session is allowed
        const check = await checkSessionLimit(userId, billingPeriodStart);

        if (!check.allowed) {
            return { success: false, error: check.error, isBillingError: true };
        }

        const session = await VoiceSession.create({
            clerkId: userId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart,
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session._id.toString(),
            maxDurationMinutes: check.maxDurationMinutes,
        }
    } catch (e) {
        console.error('Error starting voice session', e);
        return {success: false, error: 'Failed to start voice session. Please try again later.'}
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        await connectToDatabase();

        const result = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds,
        });

        if (!result) return { success: false, error: 'Voice session not found.' }

        return {
            success: true,
        };
    } catch (e) {
        console.error('Error ending voice session', e);
        return {
            success: false,
            error: 'Failed to end voice session. Please try again later.',
        };
    }
};
