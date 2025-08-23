import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-600/20 p-8 shadow-2xl">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <Link href={route('home')} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Simetri</span>
                        </Link>

                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
                            <p className="text-sm text-gray-300 mt-1">{description}</p>
                        </div>
                    </div>

                    <div>{children}</div>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Made with <span className="text-pink-400">💜</span> for Gen Z Indonesia</p>
                </div>
            </div>
        </div>
    );
}
