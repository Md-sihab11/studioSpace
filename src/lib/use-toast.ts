"use client"

import { toast } from "react-toastify"
import { useCallback } from "react"

export function useToast() {
  const showToast = useCallback(
    (options: {
      title?: string
      description?: string
      type?: "success" | "error" | "info" | "warning" | "loading"
      timeout?: number
    }) => {
      const message = options.description
        ? `${options.title ? options.title + " — " : ""}${options.description}`
        : options.title ?? ""

      const autoClose = options.timeout ?? 3500

      switch (options.type) {
        case "success":
          toast.success(message, { autoClose })
          break
        case "error":
          toast.error(message, { autoClose })
          break
        case "warning":
          toast.warn(message, { autoClose })
          break
        case "loading":
          toast.loading(message, { autoClose })
          break
        case "info":
        default:
          toast.info(message, { autoClose })
          break
      }
    },
    []
  )

  return { toast: showToast }
}
