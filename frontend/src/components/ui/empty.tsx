"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Empty({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center p-8 text-center", className)}
      {...props}
    />
  )
}

function EmptyHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mb-4", className)}
      {...props}
    />
  )
}

function EmptyMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted", className)}
      {...props}
    />
  )
}

function EmptyTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription }