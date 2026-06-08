"use server";
import z from "zod";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const editUserSchema = z.object({
  id: z.string(),
  email: z.string().max(145),
  name: z.string().max(145),
  city: z.string(),
  country: z.string(),
  street: z.string(),
  zip: z.string(),
  phoneNumber: z.string(),
  birthdate: z.iso.date(),
  image: z.string(),
});
type EditUserInput = z.infer<typeof editUserSchema>;

export async function EditUser(id: string, input: EditUserInput) {
  const data = editUserSchema.parse(input);
  const updateUser = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      user_info: {
        update: {
            birthdate: new Date(data.birthdate),
            phoneNumber:data.phoneNumber,
            address:{update: {city: data.city, country:data.country,  street:data.street, zip:data.zip}},
        }
      },
    },
  });
  return redirect (`/dashboard/profile`)
}
