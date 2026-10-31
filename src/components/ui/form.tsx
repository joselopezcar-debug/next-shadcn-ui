"use client"

import * as React from "react"
import { FormProvider } from "react-hook-form"

// Exportamos el proveedor de formularios estándar de react-hook-form con el alias Form
export const Form = FormProvider

// Componentes estructurales limpios para que tu ProjectForm original compile sin errores
export const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`space-y-2 ${className || ""}`} {...props} />
)
FormItem.displayName = "FormItem"

export const FormLabel = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`} {...props} />
)
FormLabel.displayName = "FormLabel"

export const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <div ref={ref} {...props} />
)
FormControl.displayName = "FormControl"

export const FormDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-muted-foreground ${className || ""}`} {...props} />
)
FormDescription.displayName = "FormDescription"

export const FormMessage = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  if (!children) return null
  return (
    <p className={`text-sm font-medium text-destructive ${className || ""}`} {...props}>
      {children}
    </p>
  )
}
FormMessage.displayName = "FormMessage"

// Componente Wrapper para mantener compatibilidad con la sintaxis del framework
export const FormField = ({ render, ...props }: { render: (data: any) => React.ReactNode; [key: string]: any }) => {
  return <>{render({ field: props })}</>
}
FormField.displayName = "FormField"
