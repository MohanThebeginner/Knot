import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Sidebar }   from '@/components/shared/Sidebar'
import { RightPanel } from '@/components/shared/RightPanel'
import { BottomNav }  from '@/components/shared/BottomNav'
import { Navbar }     from '@/components/shared/Navbar'

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Mobile top bar */}
      <Navbar />

      <div className="flex flex-1 w-full max-w-8xl mx-auto">
        {/* Left sidebar — desktop only */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0 border-x border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="min-h-screen pb-20 md:pb-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right panel — large screens only */}
        <RightPanel />
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
