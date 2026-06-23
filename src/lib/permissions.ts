import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
    article: ["create", "update", "delete", "comment", "like", "dislike", "read", "bookmark"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    article: ["like", "dislike"],
});

export const basic = ac.newRole({
    article: ["comment", "like", "dislike", "read"],
});

export const pro = ac.newRole({
    article: ["read", "like", "dislike", "comment", "bookmark"],
});

export const admin = ac.newRole({
    article: ["create", "update", "delete", "comment", "like", "dislike", "read"],

    ...adminAc.statements,
});

export const editor = ac.newRole({
    article: ["create", "update", "delete", "comment", "like", "dislike", "read"],
});

export const roles = ["user", "basic", "pro", "admin", "editor"];
