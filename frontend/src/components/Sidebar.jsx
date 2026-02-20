import React from 'react';
import { Home, BookOpen, BrainCircuit, MessageSquare, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: BookOpen, label: 'My Library', path: '/library' },
        { icon: MessageSquare, label: 'Ask AI', path: '/chat' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <BookOpen className="w-8 h-8" />
                    EduAssist
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            location.pathname === item.path
                                ? "bg-blue-50 text-primary font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 w-full">
                    <Settings className="w-5 h-5" />
                    Settings
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
