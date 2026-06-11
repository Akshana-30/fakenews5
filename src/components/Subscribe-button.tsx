"USE CLIENT"
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";


export default function SubButton(){

    // GET DATABASE NAMES AND ID

    const handleClick = async () => {
        await authClient.subscription.upgrade({
        plan: "Basic", // USE DATABASE NAME
        successUrl: "http://localhost:3000",

    })
    }

    return ( 
        <Button
        onClick={() => handleClick()}
        >
            Subscribe
        </Button>
    )
}