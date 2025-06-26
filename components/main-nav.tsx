"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Droplets, Zap, BarChart3, Users, Settings, MenuIcon } from "lucide-react"

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    name: 'Wells',
    href: '/wells',
    icon: Droplets,
  },
  {
    name: 'Chainlink',
    href: '/chainlink',
    icon: Zap,
  },
  {
    name: 'Staking',
    href: '/staking',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

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
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
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
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center py-2 text-lg font-semibold',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
