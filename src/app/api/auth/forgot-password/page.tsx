import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ForgotPasswordForm from "./_components/forgot-password-form";


export default async function SignInPage(){
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session){
        redirect('/')
    }
    return(
       
    <div className=""><ForgotPasswordForm/></div>
)
}