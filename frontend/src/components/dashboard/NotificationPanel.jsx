import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markAsRead, markAllAsRead } from '../../store/slices/notificationSlice'

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef(null)
  const dispatch = useDispatch()
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkRead = (id) => {
    dispatch(markAsRead(id))
  }

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead())
  }

  const getNotifIcon = (type) => {
    switch (type) {
      case 'recommendation': return '✨'
      case 'course': return '📚'
      case 'job': return '💼'
      case 'quiz': return '📝'
      case 'system': return '🔔'
      default: return '📌'
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
      >
        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 glass-card border border-white/10 rounded-2xl shadow-glass overflow-hidden z-50 animate-slide-up">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-72">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No notifications yet</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && handleMarkRead(notif.id)}
                  className={`p-3 border-b border-white/5 flex items-start gap-3 cursor-pointer transition-colors ${notif.read ? 'opacity-60 hover:bg-white/5' : 'bg-primary-500/5 hover:bg-primary-500/10'}`}
                >
                  <span className="text-lg mt-0.5">{getNotifIcon(notif.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 leading-relaxed">{notif.message || notif.title}</p>
                    <p className="text-[10px] text-gray-600 mt-1">{notif.time || notif.createdAt}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
