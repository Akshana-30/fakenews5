"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import ToggleChoice from "@/_actions/toggle-editors-choice";
import { Circle, CircleCheckBig } from "lucide-react";

type Props = React.ComponentProps<typeof Button> & {
  articleId: string;
  initialChoice: boolean;
};

export default function EditorsChoice({
  articleId,
  initialChoice,
  disabled,
  ...props
}: Props) {
  const router = useRouter();
  const [isChoice, setIsChoice] = useState(initialChoice);

  async function handleClick() {
    const newValue = await ToggleChoice(articleId);
    setIsChoice(newValue);
    router.refresh();
  }
  return (
    <button
      className="cursor-pointer"
      type="button"
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {isChoice ? <CircleCheckBig /> : <Circle />}
    </button>
  );
}
