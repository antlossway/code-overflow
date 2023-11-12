"use client"
import { deleteAnswer } from "@/lib/actions/answer.action"
import { deleteQuestion } from "@/lib/actions/question.action"
import Image from "next/image"
import { usePathname } from "next/navigation"
import React from "react"
type Props = {
  id: string
  type: string // Question or Answer
}
const DeleteButton = ({ id, type }: Props) => {
  const path = usePathname()
  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: id, path })
    } else {
      await deleteAnswer({ answerId: id, path })
    }
  }
  return (
    <div onClick={handleDelete}>
      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={18}
        height={18}
      />
    </div>
  )
}

export default DeleteButton
