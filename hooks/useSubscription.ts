'use client';

import { useAuth } from '@clerk/nextjs';

import { PLAN_LIMITS, PLANS, resolvePlan } from '@/lib/subscription-constants';

// Client-side plan lookup. Falls back to free tier until Clerk has loaded or when signed out.
// UI hint only: limits are enforced in the server actions.
export function useSubscription() {
    const { isLoaded, isSignedIn, has } = useAuth();

    const plan = isLoaded && isSignedIn ? resolvePlan(has) : PLANS.FREE;

    return {
        plan,
        limits: PLAN_LIMITS[plan],
        isLoaded,
    };
}

export default useSubscription;
