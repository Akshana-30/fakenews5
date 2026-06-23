import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, editor } from "./permissions";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac,
            roles: {
                admin,
                editor,
            },
        }),
        stripeClient({
            subscription: true, //if you want to enable subscription management
        }),
    ],
});
