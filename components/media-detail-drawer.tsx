"use client"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface MediaDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mediaId: string
}

export function MediaDetailDrawer({
  open,
  onOpenChange,
  mediaId,
}: MediaDetailDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-[30vw]! max-w-[30vw]! flex-col">
        <DrawerHeader className="border-b px-5 pb-4">
          <DrawerTitle className="truncate text-left text-base font-semibold"></DrawerTitle>
          <DrawerDescription className="text-left"></DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
