import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Subscription } from "@better-auth/stripe";
import { format } from "date-fns";

export default function SubscriptionHistory({ subscriptions }: { subscriptions: Subscription[] }) {
    return (
        <Table className="md:w-xl mx-auto mt-5">
            <TableCaption>A history of all your payments.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {subscriptions.map((s, i) => {
                    if (s.periodStart && s.periodEnd) {
                        return (
                            <TableRow key={i}>
                                <TableCell className="capitalize">{s.plan}</TableCell>
                                <TableCell>{format(s.periodStart, "yyyy-MM-dd")}</TableCell>
                                <TableCell>{format(s.periodEnd, "yyyy-MM-dd")}</TableCell>
                            </TableRow>
                        );
                    } else {
                        return null;
                    }
                })}
            </TableBody>
        </Table>
    );
}
