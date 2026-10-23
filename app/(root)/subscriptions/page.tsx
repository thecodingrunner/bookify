import { PricingTable } from "@clerk/nextjs";
import { Suspense } from "react";

import { CLERK_PRICING_TABLE_APPEARANCE } from "@/lib/constants";
import { PLANS } from "@/lib/subscription-constants";

const Page = () => {
    return (
        <main className="clerk-subscriptions">
            <section className="subscriptions-header">
                <h1 className="page-title-xl">Choose Your Plan</h1>
                <p className="subtitle">Upgrade for more books, more sessions, and longer conversations</p>
            </section>

            <div className="clerk-pricing-table-wrapper">
                <Suspense fallback={null}>
                    <PricingTable
                        highlightedPlan={PLANS.STANDARD}
                        newSubscriptionRedirectUrl="/"
                        appearance={CLERK_PRICING_TABLE_APPEARANCE}
                    />
                </Suspense>
            </div>
        </main>
    )
}
export default Page
