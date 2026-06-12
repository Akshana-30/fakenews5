import { getPlans } from "@/_actions/subscription-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SubCard from "./_components/sub-card";

export default async function SubscriptionsPage() {
    const plans = await getPlans();
    const user = await auth.api.getSession({ headers: await headers() });

    if (plans.success && plans.data && plans.data.length >= 1) {
        return (
            <div className="p-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-center">
                    Subscription plans
                </h1>
                <p className="md:mx-5 md:mt-5">
                    Below you can find the various subscription plans that we offer. In order to
                    subscribe to our news site, you need to first register an account.
                </p>
                <div className="mx-10 mt-5">
                    <ul>
                        {plans.data.map((p, i) => {
                            return (
                                <li key={p.id}>
                                    <SubCard plan={p} loggedIn={user ? true : false} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    } else {
        return (
            <div className="p-2">
                <p>There are no subscription plans in the database.</p>
            </div>
        );
    }
}
