"use client";

import { useState, useEffect, useRef } from "react";
import { getNotifications, markNotificationAsRead, clearAllNotifications } from "@/features/settings/services/notification.service";
import { evaluateAndGenerateReminders } from "@/features/ai-coach/services/ai-recommendation.service";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    // Evaluate reminders in the background
    await evaluateAndGenerateReminders();
    const data = await getNotifications();
    setNotifications(data);
    setIsLoading(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchNotifications();
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    await markNotificationAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-primary dark:text-primary-fixed" aria-hidden="true">
          {unreadCount > 0 ? 'notifications_active' : 'notifications'}
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white dark:ring-inverse-surface"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-inverse-surface rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container/30">
            <h3 className="font-headline-sm text-on-surface">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-label-sm font-label-sm text-on-surface-variant hover:text-error transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto" aria-live="polite">
            {isLoading ? (
              <div className="p-8 flex justify-center items-center">
                <span className="material-symbols-outlined animate-spin text-primary">sync</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-2">notifications_off</span>
                <p className="font-body-sm text-on-surface-variant">You're all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => {
                  let icon = "info";
                  let colorClass = "text-primary bg-primary/10";
                  
                  if (notif.type === 'missed_target') {
                    icon = "warning";
                    colorClass = "text-error bg-error/10";
                  } else if (notif.type === 'goal_update') {
                    icon = "flag";
                    colorClass = "text-tertiary bg-tertiary/10";
                  } else if (notif.type === 'ai_insight') {
                    icon = "psychology";
                    colorClass = "text-primary-container bg-primary-container/20";
                  }

                  return (
                    <div 
                      key={notif.id}
                      onClick={() => handleMarkRead(notif.id, notif.is_read)}
                      className={`p-4 border-b border-outline-variant/20 hover:bg-surface-variant/20 transition-colors cursor-pointer flex gap-4 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-label-md truncate mb-0.5 ${!notif.is_read ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                          {notif.title}
                        </p>
                        <p className="font-body-sm text-on-surface-variant text-sm line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="font-label-sm text-[10px] text-on-surface-variant/70 mt-1">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
