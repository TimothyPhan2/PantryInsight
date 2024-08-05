import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {  MenuIcon, ChefHatIcon } from "lucide-react";
import AuthButton from "./AuthButton";

export default function NavBar() {
  return (
    <header className="w-full bg-background">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ChefHatIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">PantryInsight</span>
        </Link>
        <nav className="hidden md:flex items-center gap-28 text-sm font-medium">
          <Link href="/" className="text-black hover:underline">
            Home
          </Link>
          <Link href="/recipe" className="text-muted-foreground hover:underline">
            Recipes
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <AuthButton />
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Menu options for navigation</SheetDescription>
              <div className="grid gap-4 py-6 px-4">
                <Link href="/" className="text-lg font-medium text-primary-foreground hover:underline">
                  Home
                </Link>
                <Link href="/recipe" className="text-lg font-medium text-muted-foreground hover:underline">
                  Recipes
                </Link>
                <AuthButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
