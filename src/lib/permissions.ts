import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
    article: [
        "create",
        "update", // generic update permission (ownership checked in app code)
        "updateOwn", // optional: split out if you want it explicit, see note below
        "delete",
        "comment",
        "like",
        "dislike",
        "read",
        "bookmark",
    ],
} as const;

export const ac = createAccessControl(statement);

// guest: not logged in at all — see note below, this role mostly exists for symmetry
export const guest = ac.newRole({
    article: ["read"],
});

export const user = ac.newRole({
    article: ["like", "dislike", "read"],
});

export const basic = ac.newRole({
    article: ["comment", "like", "dislike", "read"],
});

export const pro = ac.newRole({
    article: ["comment", "like", "dislike", "read", "bookmark"],
});

export const editor = ac.newRole({
    article: ["create", "update", "read", "comment", "like", "dislike"],
});

export const admin = ac.newRole({
    article: ["create", "update", "delete", "comment", "like", "dislike", "read", "bookmark"],
    ...adminAc.statements,
});

export const roles = ["user", "basic", "pro", "admin", "editor"];

// --- Non-access-control role metadata (your own lookup tables) ---

export const ROLE_SHOWS_ADS: Record<string, boolean> = {
    guest: true,
    user: true,
    basic: true,
    pro: false,
    editor: false,
    admin: false,
};

export const ROLE_READ_LIMIT: Record<string, number | null> = {
    guest: 500,
    user: 500,
    basic: null, // full access
    pro: null,
    editor: null,
    admin: null,
};
