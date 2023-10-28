"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
type Props = {
  id: string;
  type: string; // Question or Answer
};
const EditButton = ({ id, type }: Props) => {
  const path = usePathname();
  const handleEdit = async () => {
    // if (type === "Question") {
    //   await EditQuestion({ questionId: id, path });
    // }
  };
  return (
    <div onClick={handleEdit}>
      <Image src="/assets/icons/edit.svg" alt="Edit" width={18} height={18} />
    </div>
  );
};

export default EditButton;
