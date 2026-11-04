"use client"

import { toast as sonnerToast } from "sonner"
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

      const duration = options.timeout ?? 3500

      switch (options.type) {
        case "success":
          sonnerToast.success(message, { duration })
          break
        case "error":
          sonnerToast.error(message, { duration })
          break
        case "warning":
          sonnerToast.warning(message, { duration })
          break
        case "loading":
          sonnerToast.loading(message, { duration })
          break
        case "info":
        default:
          sonnerToast.info(message, { duration })
          break
      }
    },
    []
  )

  return { toast: showToast }
}
