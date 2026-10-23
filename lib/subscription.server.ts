import {auth} from "@clerk/nextjs/server";
import {PLAN_LIMITS, PLANS, PlanType, resolvePlan} from "@/lib/subscription-constants";

// Server-side plan lookup. Signed-out users are treated as free tier.
export const getUserPlan = async (): Promise<PlanType> => {
    const { isAuthenticated, has } = await auth();

    if (!isAuthenticated) return PLANS.FREE;

    return resolvePlan(has);
}

export const getUserPlanLimits = async () => {
    const plan = await getUserPlan();

    return { plan, limits: PLAN_LIMITS[plan] };
}
