import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Masuk ke akun Anda" description="Masukkan email dan kata sandi Anda di bawah untuk masuk">
            <Head title="Masuk" />

            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm text-gray-200">Alamat email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@contoh.com"
                            className="bg-gray-800 text-white placeholder-gray-400"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-sm text-gray-200">Kata Sandi</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-purple-300 hover:text-white" tabIndex={5}>
                                    Lupa kata sandi?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Kata Sandi"
                            className="bg-gray-800 text-white placeholder-gray-400"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember" className="text-gray-200">Ingat saya</Label>
                        </div>
                        <div className="text-sm text-gray-400">
                            <Link href={route('home')} className="text-purple-300 hover:text-white">Kembali ke Home</Link>
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 py-3 rounded-full shadow-lg flex items-center justify-center gap-3"
                        tabIndex={4}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        <span>Masuk</span>
                    </button>
                </div>

                <div className="text-center text-sm text-gray-400">
                    Belum punya akun?{' '}
                    <TextLink href={route('register')} className="text-purple-300 hover:text-white" tabIndex={5}>
                        Daftar
                    </TextLink>
                </div>

                {status && <div className="mt-2 text-center text-sm font-medium text-green-400">{status}</div>}
            </form>
        </AuthLayout>
    );
}
