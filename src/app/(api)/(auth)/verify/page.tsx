import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
    return (
        <Card className="flex w-2xl mx-auto h-30 mt-10">
            <CardHeader>
                <CardTitle>Verify email</CardTitle>
            </CardHeader>
            <CardContent>
                An email has been sent to the email adress you provided. Click the link in the mail,
                in order to verify your email address. After that you can log in with your new
                account.
            </CardContent>
        </Card>
    );
}
