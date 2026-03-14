import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

export function ResponsiveDrawer() {
	return (
		<div className="flex flex-wrap gap-2">
			{SHEET_SIDES.map((side) => (
				<Sheet key={side}>
					<SheetTrigger asChild>
						<Button variant="outline" className="capitalize">
							{side}
						</Button>
					</SheetTrigger>
					<SheetContent
						side={side}
						className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
					>
						<SheetHeader>
							<SheetTitle>Edit profile</SheetTitle>
							<SheetDescription>
								Make changes to your profile here. Click save when you&apos;re
								done.
							</SheetDescription>
						</SheetHeader>
						<div className="no-scrollbar overflow-y-auto px-4"></div>
						<SheetFooter>
							<Button type="submit">Save changes</Button>
							<SheetClose asChild>
								<Button variant="outline">Cancel</Button>
							</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			))}
		</div>
	);
}
