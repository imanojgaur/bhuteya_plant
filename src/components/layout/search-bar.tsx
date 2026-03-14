"use client"

import { Search } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function SearchBar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Search className="h-5 w-5" />
          <span>Search...</span>
        </button>
      </SheetTrigger>

      <SheetContent side="top" className="flex w-full justify-center pb-8 pt-12">
        <Command className="w-full max-w-3xl bg-transparent">
          <CommandInput 
            placeholder="Search projects, categories..." 
            className="h-14 border-b-2 text-2xl"
          />
          <CommandList className="mt-6">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Links" className="text-lg">
              <CommandItem className="py-3 text-base">gaur.dev Portfolio</CommandItem>
              <CommandItem className="py-3 text-base">Renewable Energy Concepts</CommandItem>
              <CommandItem className="py-3 text-base">Plant App Concepts</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </SheetContent>
    </Sheet>
  )
}