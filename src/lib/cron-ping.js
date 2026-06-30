"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_cron_1 = require("node-cron");
// import prisma from "./prisma";
node_cron_1.default.schedule("* * * * *", function () {
    console.log("Running a task every minute");
});
// async function generateNewsletter(userId: string) {
//     const userInfo = await prisma.userInfo.findUnique({ where: { userId: userId } });
//     console.log(userInfo);
// }
// generateNewsletter("EQU4LXMp2WgxOdJ2X5P0eGqZ3qxyxIHQ");
