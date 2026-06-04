import RouteHeading from "@/components/route-heading";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import EditProfileForm from "./_components/edit-profile-form";
import { notFound } from "next/navigation";
import { phoneNumber } from "better-auth/plugins";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      user_info: {
        select: {
          birthdate: true,
          phoneNumber: true,
          address: {
            select: { city: true, country: true, street: true, zip: true },
          },
        },
      },
      accounts: { select: { password: true } },
    },
  });

  if (!userInfo) {
    notFound();
  }

  return (
    
    <div className="">
      <RouteHeading label="Dashboard"/>
      <div className="pt-4"><EditProfileForm user={userInfo} /></div>
      
    </div>
  );
}
