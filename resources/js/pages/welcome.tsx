import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Simetri - Aplikasi Keuangan Gen Z">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>
            
            {/* Main Container */}
            <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white">
                
                {/* Navigation */}
                <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">S</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Simetri
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-purple-300 hover:text-white px-4 py-2 rounded-lg hover:bg-purple-800/30 transition-all duration-200"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                                        >
                                            Daftar Gratis
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                                    Kelola Duit
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                                    Jadi Lebih Aman
                                </span>
                            </h1>
                            
                            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Platform keuangan all-in-one yang bikin hidup lu lebih teratur. 
                                Dari tracking pengeluaran sampai investasi, semua ada di sini! 💸✨
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                {!auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                                    >
                                        Mulai Gratis Sekarang 🚀
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Gratis Forever
                                    </span>
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        No Hidden Fees
                                    </span>
                                </div>
                            </div>
                            
                            {/* Hero Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                                <div className="text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        10K+
                                    </div>
                                    <div className="text-gray-400 text-sm">User Aktif</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        4.9★
                                    </div>
                                    <div className="text-gray-400 text-sm">Rating App</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        24/7
                                    </div>
                                    <div className="text-gray-400 text-sm">AI Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Overview Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-black/40">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    Fitur yang Bikin
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Keuangan Lu Makin Cuan 📈
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                                Semua yang lu butuhin buat ngatur duit, dari yang basic sampai yang advanced!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Account Management */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl">💳</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">Multi Account</h3>
                                <p className="text-gray-300 mb-4">
                                    Kelola semua rekening lu dalam satu app. Bank, e-wallet, cash, semuanya bisa!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">Bank Account</span>
                                    <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">E-Wallet</span>
                                    <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">Cash</span>
                                </div>
                            </div>

                            {/* Transaction Tracking */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">Smart Tracking</h3>
                                <p className="text-gray-300 mb-4">
                                    Catat pemasukan & pengeluaran otomatis. Analytics yang detail buat tau kemana aja duit lu pergi.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-pink-600/30 text-pink-200 rounded-full text-xs">Auto Categorize</span>
                                    <span className="px-3 py-1 bg-pink-600/30 text-pink-200 rounded-full text-xs">Real-time</span>
                                </div>
                            </div>

                            {/* Financial Goals */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">Goal Setting</h3>
                                <p className="text-gray-300 mb-4">
                                    Bikin target finansial yang realistis. Mau nabung buat iPhone terbaru atau liburan? We got you!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs">Target Tracking</span>
                                    <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs">Progress</span>
                                </div>
                            </div>

                            {/* Assets & Investments */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl">💎</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">Asset Management</h3>
                                <p className="text-gray-300 mb-4">
                                    Track investasi lu, dari saham, crypto, emas, sampai properti. Semua dalam satu dashboard.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-xs">Stocks</span>
                                    <span className="px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-xs">Crypto</span>
                                    <span className="px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-xs">Real Estate</span>
                                </div>
                            </div>

                            {/* Debt Management */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">Debt Tracker</h3>
                                <p className="text-gray-300 mb-4">
                                    Kelola semua hutang lu dengan smart. Dari credit card sampai KTA, jangan sampai telat bayar!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-red-600/30 text-red-200 rounded-full text-xs">Payment Alert</span>
                                    <span className="px-3 py-1 bg-red-600/30 text-red-200 rounded-full text-xs">Interest Calc</span>
                                </div>
                            </div>

                            {/* Recurring Transactions */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl">🔄</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">Auto Recurring</h3>
                                <p className="text-gray-300 mb-4">
                                    Set transaksi berulang kayak bayar listrik, Netflix, atau transfer ke ortu. Sekali set, auto jalan!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-yellow-600/30 text-yellow-200 rounded-full text-xs">Monthly</span>
                                    <span className="px-3 py-1 bg-yellow-600/30 text-yellow-200 rounded-full text-xs">Weekly</span>
                                    <span className="px-3 py-1 bg-yellow-600/30 text-yellow-200 rounded-full text-xs">Custom</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Assistant Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-black/40 to-purple-900/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="mb-6">
                                    <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                        🤖 AI-Powered
                                    </span>
                                </div>
                                
                                <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                    <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        Asisten AI yang
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        Paham Finansial 🧠
                                    </span>
                                </h2>
                                
                                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                    Chat sama AI yang ngerti banget soal keuangan. Tanya apa aja, dari tips hemat sampai strategi investasi. 
                                    Available 24/7 dan gak pernah nge-judge spending habit lu! 😅
                                </p>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                        <span className="text-gray-300">Analisis spending pattern lu secara real-time</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                        <span className="text-gray-300">Kasih saran budgeting yang personalized</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                        <span className="text-gray-300">Jawab pertanyaan finansial dalam bahasa sehari-hari</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                        <span className="text-gray-300">Reminder pembayaran & tips hemat yang relevan</span>
                                    </div>
                                </div>
                                
                                {!auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                                    >
                                        Coba AI Assistant Gratis
                                    </Link>
                                )}
                            </div>
                            
                            <div className="relative">
                                {/* Chat Interface Mockup */}
                                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
                                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-700">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">AI</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">Simetri AI Assistant</div>
                                            <div className="text-green-400 text-sm flex items-center">
                                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                                Online
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 mb-6">
                                        {/* User Message */}
                                        <div className="flex justify-end">
                                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-2xl rounded-br-md max-w-xs">
                                                Halo! Gimana cara ngatur budget buat anak kos?
                                            </div>
                                        </div>
                                        
                                        {/* AI Response */}
                                        <div className="flex justify-start">
                                            <div className="bg-gray-800 text-gray-100 p-4 rounded-2xl rounded-bl-md max-w-sm">
                                                <p className="mb-3">Halo! Great question! 🙌</p>
                                                <p className="mb-3">Untuk anak kos, coba pakai rule 50-30-20:</p>
                                                <ul className="text-sm space-y-1 mb-3">
                                                    <li>• 50% kebutuhan (makan, kos)</li>
                                                    <li>• 30% keinginan (nongkrong, hobi)</li>
                                                    <li>• 20% tabungan</li>
                                                </ul>
                                                <p className="text-purple-300">Mau aku buatin budget plan yang detail?</p>
                                            </div>
                                        </div>
                                        
                                        {/* User typing indicator */}
                                        <div className="flex justify-start">
                                            <div className="bg-gray-800 text-gray-400 p-3 rounded-2xl rounded-bl-md">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Input area */}
                                    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                                        <input 
                                            type="text" 
                                            placeholder="Tanya apa aja tentang keuangan..."
                                            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                                            disabled
                                        />
                                        <button className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">→</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Floating elements */}
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"></div>
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-black/40">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="mb-6">
                                <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    💬 What Gen Z Says
                                </span>
                            </div>
                            
                            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    Mereka yang Udah
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Merasakan Benefitnya 🎉
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                                Real stories dari user yang hidupnya jadi lebih organized berkat Simetri
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">A</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">@aryasaputra</div>
                                        <div className="text-purple-300 text-sm">Mahasiswa UI</div>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <div className="flex items-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        "Gila sih ini app! Dulu gue boros banget, sekarang jadi tau kemana aja duit gue pergi. 
                                        AI assistantnya juga helpful banget kasih tips hemat. Sekarang udah bisa nabung buat PS5! 🎮"
                                    </p>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-400">
                                    <span className="mr-2">📅</span>
                                    <span>User sejak 6 bulan lalu</span>
                                </div>
                            </div>

                            {/* Testimonial 2 */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">S</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">@sarimelati</div>
                                        <div className="text-purple-300 text-sm">Fresh Graduate</div>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <div className="flex items-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        "Sebagai anak kos yang baru kerja, aplikasi ini life-saver banget! Goal saving feature-nya 
                                        bikin gue termotivasi nabung. Udah berhasil ngumpulin dana darurat 6 bulan dalam setahun! 💪"
                                    </p>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-400">
                                    <span className="mr-2">📅</span>
                                    <span>User sejak 1 tahun lalu</span>
                                </div>
                            </div>

                            {/* Testimonial 3 */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">R</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">@rizkypratama</div>
                                        <div className="text-purple-300 text-sm">Content Creator</div>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <div className="flex items-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        "Income gue sebagai creator gak stabil, tapi dengan Simetri jadi bisa planning keuangan 
                                        dengan baik. Debt tracker-nya juga membantu banget buat ngatur cicilan kamera. Recommended! 📸"
                                    </p>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-400">
                                    <span className="mr-2">📅</span>
                                    <span>User sejak 8 bulan lalu</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof Stats */}
                        <div className="mt-16 text-center">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                                <div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                        95%
                                    </div>
                                    <div className="text-gray-400 text-sm">User puas dengan fitur AI</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                        3x
                                    </div>
                                    <div className="text-gray-400 text-sm">Lebih rajin nabung</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                        50%
                                    </div>
                                    <div className="text-gray-400 text-sm">Pengurangan pengeluaran</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                        4.9★
                                    </div>
                                    <div className="text-gray-400 text-sm">Rating di App Store</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Financial Education Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-black/40 to-purple-900/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="mb-6">
                                <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    📚 Financial Edu
                                </span>
                            </div>
                            
                            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    Belajar Finansial
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Sambil Ngopi ☕
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                                Konten edukatif yang gak boring! Dari basic sampai advanced, semua dijelasin dengan bahasa yang mudah dipahami.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                            <div>
                                <div className="space-y-8">
                                    {/* Education Item 1 */}
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">🎓</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Financial Principles</h3>
                                            <p className="text-gray-300 mb-3">
                                                Step-by-step guide dari dasar banget. Mulai dari bedain wants vs needs sampai investment 101.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">Budgeting</span>
                                                <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">Saving</span>
                                                <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">Investing</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Education Item 2 */}
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">📈</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
                                            <p className="text-gray-300 mb-3">
                                                Monitor perkembangan financial literacy lu! Dari newbie sampai jadi financial guru di circle pertemanan.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-pink-600/30 text-pink-200 rounded-full text-xs">Level System</span>
                                                <span className="px-3 py-1 bg-pink-600/30 text-pink-200 rounded-full text-xs">Achievements</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Education Item 3 */}
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">🎯</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Interactive Learning</h3>
                                            <p className="text-gray-300 mb-3">
                                                Quiz, challenge, dan simulation yang seru! Belajar sambil main, gak kerasa udah jago managing money.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs">Quiz</span>
                                                <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs">Challenges</span>
                                                <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs">Simulations</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Learning Progress Mockup */}
                                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-white font-bold text-lg">Financial Learning Path</h3>
                                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm">Level 3</span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {/* Completed Module */}
                                        <div className="flex items-center space-x-3 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">✓</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium">Budgeting Basics</div>
                                                <div className="text-green-300 text-sm">Completed • 100%</div>
                                            </div>
                                            <div className="text-green-400 font-bold">+50 XP</div>
                                        </div>

                                        {/* Current Module */}
                                        <div className="flex items-center space-x-3 p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">⚡</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium">Emergency Fund Strategy</div>
                                                <div className="text-purple-300 text-sm">In Progress • 65%</div>
                                                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '65%'}}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Locked Module */}
                                        <div className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
                                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">🔒</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-gray-400 font-medium">Investment Fundamentals</div>
                                                <div className="text-gray-500 text-sm">Unlock at Level 4</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">Next Reward</span>
                                            <span className="text-purple-300 text-sm">150 XP to go</span>
                                        </div>
                                        <div className="text-gray-300 text-sm">🏆 Financial Guru Badge</div>
                                    </div>
                                </div>
                                
                                {/* Floating elements */}
                                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
                                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-r from-yellow-500 to-purple-500 rounded-full opacity-10 blur-2xl"></div>
                            </div>
                        </div>

                        {/* Education Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
                            <div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    50+
                                </div>
                                <div className="text-gray-400 text-sm">Learning Modules</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    15 min
                                </div>
                                <div className="text-gray-400 text-sm">Per Module</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    89%
                                </div>
                                <div className="text-gray-400 text-sm">Completion Rate</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    24/7
                                </div>
                                <div className="text-gray-400 text-sm">Access</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security & Trust Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-black/40">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="mb-6">
                                <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    🔐 Bank-Level Security
                                </span>
                            </div>
                            
                            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    Data Lu Aman,
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Privasi Terjaga 🛡️
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                                Keamanan level perbankan + enkripsi terdepan. Data finansial lu dijaga ketat, privacy is our priority!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {/* Security Feature 1 */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">🔒</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">256-bit Encryption</h3>
                                <p className="text-gray-300 mb-4">
                                    Level enkripsi yang sama dengan bank internasional. Data lu ter-encrypt dengan teknologi militer grade.
                                </p>
                                <span className="inline-block px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-xs">SSL/TLS Protected</span>
                            </div>

                            {/* Security Feature 2 */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">🚫</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">Zero Data Selling</h3>
                                <p className="text-gray-300 mb-4">
                                    We NEVER jual data lu ke pihak ketiga. Privacy lu adalah hak, bukan komoditas yang diperjualbelikan.
                                </p>
                                <span className="inline-block px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">GDPR Compliant</span>
                            </div>

                            {/* Security Feature 3 */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">⚡</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">Real-time Monitoring</h3>
                                <p className="text-gray-300 mb-4">
                                    AI security system yang 24/7 monitoring aktivitas mencurigakan. Auto-alert kalo ada yang aneh.
                                </p>
                                <span className="inline-block px-3 py-1 bg-yellow-600/30 text-yellow-200 rounded-full text-xs">AI Protected</span>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Kenapa Bisa Dipercaya?</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-white text-sm">✓</span>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium mb-1">Regular Security Audits</div>
                                            <div className="text-gray-300 text-sm">Security audit rutin oleh cybersecurity firm terkemuka untuk memastikan sistem tetap aman.</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-white text-sm">✓</span>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium mb-1">Transparent Operations</div>
                                            <div className="text-gray-300 text-sm">Semua operasi transparan, ada laporan bulanan, dan customer support yang responsif 24/7.</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-white text-sm">✓</span>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium mb-1">Local Indonesian Team</div>
                                            <div className="text-gray-300 text-sm">Tim developer dan support 100% orang Indonesia yang paham culture dan kebutuhan lokal.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Security Dashboard Mockup */}
                                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-white font-bold text-lg">Security Center</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-green-400 text-sm">All Systems Secure</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {/* Security Status */}
                                        <div className="p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-white font-medium">🔐 Account Security</span>
                                                <span className="text-green-400 text-sm font-bold">100%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full w-full"></div>
                                            </div>
                                        </div>

                                        {/* Privacy Status */}
                                        <div className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-white font-medium">🛡️ Privacy Protection</span>
                                                <span className="text-purple-400 text-sm font-bold">Active</span>
                                            </div>
                                            <div className="text-gray-300 text-sm">Last scan: 2 minutes ago</div>
                                        </div>

                                        {/* Activity Log */}
                                        <div className="p-4 bg-gray-800/50 border border-gray-700/30 rounded-lg">
                                            <div className="text-white font-medium mb-3">Recent Activity</div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-300">✅ Login from Jakarta</span>
                                                    <span className="text-gray-500">2m ago</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-300">🔄 Data backup completed</span>
                                                    <span className="text-gray-500">1h ago</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-300">🔒 Security scan passed</span>
                                                    <span className="text-gray-500">3h ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating security badges */}
                                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
                                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10 blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-black/40 to-purple-900/20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                🚀 Ready to Level Up?
                            </span>
                        </div>
                        
                        <h2 className="text-3xl sm:text-6xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                                Jadi Generasi yang
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                                Melek Finansial! 💰
                            </span>
                        </h2>
                        
                        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Jangan biarkan uang jadi stress. Mulai atur keuangan dengan smart, 
                            capai financial goals lu, dan live your best life! ✨
                        </p>
                        
                        {!auth.user ? (
                            <div className="space-y-6">
                                <Link
                                    href={route('register')}
                                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                                >
                                    Daftar Sekarang, Gratis! 🎯
                                </Link>
                                
                                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
                                    <span className="flex items-center">
                                        <span className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </span>
                                        No credit card required
                                    </span>
                                    <span className="flex items-center">
                                        <span className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </span>
                                        Setup in under 2 minutes
                                    </span>
                                    <span className="flex items-center">
                                        <span className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </span>
                                        Cancel anytime
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href={route('dashboard')}
                                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                            >
                                Buka Dashboard 📊
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20 bg-black/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">S</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Simetri
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                <span>© 2025 Simetri. All rights reserved.</span>
                                <span>•</span>
                                <span>Made with 💜 for Gen Z Indonesia</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-purple-500/10 text-center">
                            <p className="text-gray-500 text-sm">
                                Simetri - Platform Keuangan untuk Generasi Digital 🇮🇩
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
