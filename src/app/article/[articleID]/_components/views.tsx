import { Eye } from "lucide-react";

export default function Views({ num }: { num: number }) {
    return (
        <>
            <Eye size={20} />
            <span className="my-auto ml-1">{num}</span>
        </>
    );
}
