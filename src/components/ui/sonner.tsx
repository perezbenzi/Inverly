import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: 
            "group toast group-[.toaster]:bg-green-100 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-green-900 dark:group-[.toaster]:text-green-50 dark:group-[.toaster]:border-green-800",
          error: 
            "group toast group-[.toaster]:bg-red-100 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-red-900 dark:group-[.toaster]:text-red-50 dark:group-[.toaster]:border-red-800",
          warning: 
            "group toast group-[.toaster]:bg-yellow-100 group-[.toaster]:text-yellow-900 group-[.toaster]:border-yellow-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-yellow-900 dark:group-[.toaster]:text-yellow-50 dark:group-[.toaster]:border-yellow-800",
          info: 
            "group toast group-[.toaster]:bg-blue-100 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-blue-900 dark:group-[.toaster]:text-blue-50 dark:group-[.toaster]:border-blue-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
