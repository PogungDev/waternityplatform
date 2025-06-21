"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Droplets, MenuIcon } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/investor", label: "Investor" },
    { href: "/partner", label: "Field Partner" },
    { href: "/how-it-works", label: "How It Works" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Title */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Droplets className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">Waternity</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle mobile menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <Link href="/" className="flex items-center space-x-2 py-4">
              <Droplets className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">Waternity</span>
            </Link>
            <nav className="grid gap-2 text-lg font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center py-2 text-lg font-semibold",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
