"use server";

import { roles } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Name is required, atleast 3 characters")
    .max(50, "Maximum of 50 characters"),
  email: z.email(),
  image: z.string(),
  phone: z.string(),
  birthdate: z.iso.date(),
  role: z.enum(roles),
  authorAlias: z.string().max(20, "Maximum 20 characters"),
  street: z.string(),
  city: z.string(),
  zip: z.string(),
  country: z.string(),
  userInfoId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;
export default async function UserAction(id: string, input: FormValues): Promise<Result<string>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, error: "You must be signed in." };
  }
  if (session.user.role !== "admin") {
    return { success: false, error: "Only admins can edit user accounts." };
  }

  const data = formSchema.parse(input);

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  const isDemotingFromAdmin = target?.role === "admin" && data.role !== "admin";

  if (isDemotingFromAdmin) {
    if (session.user.id === id) {
      return { success: false, error: "You cannot remove your own admin role." };
    }

    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      return {
        success: false,
        error: "Cannot remove the last admin — promote another user to admin first.",
      };
    }
  }

  const existingAuthor = await prisma.author.findUnique({ where: { userId: id } });
  const aliasChanged = existingAuthor?.alias !== data.authorAlias;
  const shouldUpdateAlias = data.role !== "user" && data.authorAlias && aliasChanged;

  const editUser = await prisma.user.update({
    where: { id },
    data: {
      role: data.role,
      name: data.name,
      email: data.email,
      image: data.image,
      user_info: {
        upsert: {
          update: {
            phoneNumber: data.phone,
            birthdate: new Date(data.birthdate),
            address: {
              upsert: {
                update: {
                  city: data.city,
                  country: data.country,
                  street: data.street,
                  zip: data.zip,
                },
                create: {
                  city: data.city,
                  country: data.country,
                  street: data.street,
                  zip: data.zip,
                },
              },
            },
          },
          create: {
            phoneNumber: data.phone,
            birthdate: new Date(data.birthdate),
            address: {
              connectOrCreate: {
                where: { id: data.userInfoId },
                create: {
                  city: data.city,
                  country: data.country,
                  street: data.street,
                  zip: data.zip,
                },
              },
            },
          },
        },
      },
      ...(shouldUpdateAlias
        ? {
            author: {
              upsert: {
                update: { alias: data.authorAlias },
                create: { alias: data.authorAlias },
              },
            },
          }
        : {}),
    },
  });

  revalidatePath("/dashboard/admin/users");
  return { success: true, data: editUser.id };
}
