import { getPlans } from "@/_actions/subscription-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import SubButton from "./_components/sub-button";

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
                                    <Card className="flex w-lg mx-auto">
                                        <CardHeader>
                                            <CardTitle>{p.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex">
                                            <div className="border mr-4">
                                                {p.image ? (
                                                    <Image src={p.image} alt={p.name} />
                                                ) : (
                                                    <div className="flex w-full h-full items-center justify-center">
                                                        <span className="uppercase opacity-50 text-xs">
                                                            No image
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p>{p.description}</p>
                                        </CardContent>
                                        <CardFooter className="justify-center">
                                            <SubButton
                                                plan={p.name}
                                                disabled={user ? false : true}
                                            />
                                        </CardFooter>
                                    </Card>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}
