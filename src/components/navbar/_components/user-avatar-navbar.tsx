import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@/components/ui/avatar";

export default function UserAvatarNavbar({
    imageUrl,
    fallbackTxt,
}: {
    imageUrl: string;
    fallbackTxt: string;
}) {
    return (
        <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
            <Avatar>
                <AvatarImage src={imageUrl} alt="avatar" />
                <AvatarFallback>{fallbackTxt}</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
        </div>
    );
}
