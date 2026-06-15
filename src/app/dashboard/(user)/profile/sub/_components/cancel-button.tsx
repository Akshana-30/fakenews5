import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function CancelButton({ subscriptionId }: { subscriptionId: string }) {
    async function handleClick() {
        const { data, error } = await authClient.subscription.cancel({
            subscriptionId: subscriptionId,
            returnUrl: "/dashboard/profile/sub",
        });
    }

    return (
        <Button className="cursor-pointer" variant="destructive" onClick={handleClick}>
            Cancel
        </Button>
    );
}
