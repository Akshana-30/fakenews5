import { getPlan } from "@/_actions/subscription-actions";
import EditPlanForm from "./_components/edit-plan-form";
import RouteHeading from "@/components/route-heading";
import { DataTable } from "@/components/Data-table";
import { columns } from "../../_components/columns";

export default async function EditPlanPage({ params }: { params: Promise<{ planId: string }> }) {
    const { planId } = await params;
    const res = await getPlan(planId);
    if (res.success && res.data) {
        const plan = res.data;
        return (
            <div className="p-2">
                <RouteHeading label={`Edit subscription plan ${plan.name}`} />
                <div className="flex justify-center mt-4">
                    <EditPlanForm plan={plan} />
                </div>
            </div>
        );
    }
}
