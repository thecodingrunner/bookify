import type {PlanLimits} from "@/types";

// Plan slugs as configured in the Clerk Dashboard. Users without a subscription are on the free tier.
export const PLANS = {
    FREE: 'free',
    STANDARD: 'standard',
    PRO: 'pro',
} as const;

export type PlanType = typeof PLANS[keyof typeof PLANS];

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    [PLANS.FREE]: {
        maxBooks: 1,
        maxSessionsPerMonth: 5,
        maxSessionMinutes: 5,
        hasSessionHistory: false,
    },
    [PLANS.STANDARD]: {
        maxBooks: 10,
        maxSessionsPerMonth: 100,
        maxSessionMinutes: 15,
        hasSessionHistory: true,
    },
    [PLANS.PRO]: {
        maxBooks: 100,
        maxSessionsPerMonth: Infinity,
        maxSessionMinutes: 60,
        hasSessionHistory: true,
    },
};

// Resolves the user's plan from Clerk's has() check (works with both server auth() and client useAuth())
// Checks the highest tier first so a user is never downgraded by plan ordering
export const resolvePlan = (has: (params: { plan: string }) => boolean): PlanType => {
    if (has({ plan: PLANS.PRO })) return PLANS.PRO;
    if (has({ plan: PLANS.STANDARD })) return PLANS.STANDARD;
    return PLANS.FREE;
}

// Billing periods are tracked by calendar month
export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}
