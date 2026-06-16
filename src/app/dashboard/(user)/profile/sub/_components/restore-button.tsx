import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RestoreButton({ subscriptionId }: { subscriptionId: string }) {
    const router = useRouter();
    async function handleClick() {
        const { data, error } = await authClient.subscription.restore({
            subscriptionId: subscriptionId,
        });
        router.refresh();
    }

    return (
        <Button className="cursor-pointer bg-green-200 text-green-600" onClick={handleClick}>
            Restore
        </Button>
    );
}
