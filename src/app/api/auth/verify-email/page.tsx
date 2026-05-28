import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Verify email</CardTitle>
            </CardHeader>
            <CardContent>
                An email has been sent to the email adress you provided. Click the link in the email
                and then log in.
            </CardContent>
        </Card>
    );
}
