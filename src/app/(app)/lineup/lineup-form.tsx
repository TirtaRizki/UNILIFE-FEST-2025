"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Lineup } from "@/lib/types"

const lineupSchema = z.object({
  id: z.string().optional(),
  artistName: z.string().min(2, "Artist name is required"),
  day: z.string().min(3, "Day is required"),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
})

type LineupFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lineup: Lineup | null;
  onSave: (lineup: Lineup) => void;
}

export function LineupForm({ open, onOpenChange, lineup, onSave }: LineupFormProps) {
  const form = useForm<z.infer<typeof lineupSchema>>({
    resolver: zodResolver(lineupSchema),
    defaultValues: lineup || { artistName: "", day: "", time: "" },
  })

  useEffect(() => {
    if (open) {
      form.reset(lineup || { artistName: "", day: "", time: "" });
    }
  }, [lineup, open, form])

  function onSubmit(values: z.infer<typeof lineupSchema>) {
    const lineupData: Lineup = {
        ...values,
        id: lineup?.id || "",
    };
    onSave(lineupData);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{lineup ? "Edit Lineup" : "Add to Lineup"}</SheetTitle>
          <SheetDescription>
            {lineup ? "Update the artist details." : "Add a new artist to the lineup."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="artistName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The Headliners" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Friday" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input placeholder="HH:mm (e.g., 21:00)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="pt-4">
                <SheetClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </SheetClose>
                <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
