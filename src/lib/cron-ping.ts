import cron from "node-cron";
// import prisma from "./prisma";

cron.schedule("* * * * *", () => {
    console.log("Running a task every minute");
});

// async function generateNewsletter(userId: string) {
//     const userInfo = await prisma.userInfo.findUnique({ where: { userId: userId } });
//     console.log(userInfo);
// }

// generateNewsletter("EQU4LXMp2WgxOdJ2X5P0eGqZ3qxyxIHQ");
