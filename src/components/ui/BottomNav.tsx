import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Clock, Leaf, User, Scan } from 'lucide-react'

interface NavItem {
  icon: typeof Home
  label: string
  path: string
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Clock, label: 'History', path: '/history' },
]

const navItems2: NavItem[] = [
  { icon: Leaf, label: 'Garden', path: '/garden' },
  { icon: User, label: 'Profile', path: '/settings' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const NavButton = ({ item }: { item: NavItem }) => {
    const active = isActive(item.path)
    const Icon = item.icon
    return (
      <button
        onClick={() => navigate(item.path)}
        className="flex-1 flex flex-col items-center gap-1"
        aria-label={item.label}
      >
        <span className={`w-9 h-9 rounded-[12px] flex items-center justify-center transition-colors ${active ? 'bg-sage-deep' : 'bg-transparent'}`}>
          <Icon size={18} className={active ? 'text-white' : 'text-plant-light'} />
        </span>
        <span className={`text-[10px] font-medium ${active ? 'text-sage-deep' : 'text-plant-light'}`}>
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:rounded-3xl md:shadow-2xl bg-white border-t md:border border-cream-2 mx-auto px-2 pb-safe md:pb-2 pt-2 z-50 transition-all">
      <div className="flex items-center">
        {navItems.map(item => <NavButton key={item.path} item={item} />)}

        {/* Scan FAB */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <button
            onClick={() => navigate('/scan')}
            className="w-13 h-13 bg-sage-deep rounded-[18px] flex items-center justify-center shadow-fab -mt-3.5"
            aria-label="Scan plant"
          >
            <Scan size={22} className="text-white" />
          </button>
          <span className={`text-[10px] font-medium ${isActive('/scan') ? 'text-sage-deep' : 'text-plant-light'}`}>
            Scan
          </span>
        </div>

        {navItems2.map(item => <NavButton key={item.path} item={item} />)}
      </div>
    </nav>
  )
}
