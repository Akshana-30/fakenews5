"use server";
import { columns } from "@/lib/userColumns";
import prisma from "@/lib/prisma";
import { DataTable } from "@/components/Data-table";
import RouteHeading from "@/components/route-heading";

const user = await prisma.user.findMany({});

// TODO: Make it so that Author alias field doesn't show if the user is a normal user/subscriber and you should not be able to denote yourself as admin
export default async function UserTablePage() {
    return (
        <div className="w-full">
            <RouteHeading label="Users" />
            <DataTable columns={columns} data={user} />
        </div>
    );
}
