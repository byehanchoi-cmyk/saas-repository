import { AuthForm } from '@/components/auth/AuthForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Auth Page - Cloud Notes',
    description: 'Sign in or create an account to access your workspace.',
}

export default function AuthPage() {
    return (
        <div className="flex h-full flex-1 w-full flex-row overflow-hidden font-display antialiased selection:bg-primary/30 selection:text-primary">
            {/* Left Side: Brand/Image Section */}
            <div
                className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVoF3BBfdyv4Npd9E54sGA3M-Z79el64mq4xdAoWu-9FNsmrcMgTM0guJRVEW-4pXwYYoSMU_xoyMG2_UBwyAXiMPZEPKO_vAc_Dvt7-NMANNxMIqhezJONZGjhBLOqvNybUqY1uOMJllMZ0voM35KqXi5xS8olG6YmVBZEa9qFwnCf22WJbn1zIqAuiRTkCQfL6Vpi9bK0JgJi_D4uzhxpdXigNL1p4F2zq8srxRYSM14nS9BTMggGUVMEsPbSds9kGJ7znDX_lRj")' }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-primary/80 mix-blend-multiply z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent z-0"></div>

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white">
                        <span className="material-symbols-outlined text-2xl">edit_note</span>
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white">NoteCloud</span>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <blockquote className="text-2xl font-medium leading-relaxed text-white">
                        &quot;This platform completely transformed how I organize my thoughts. The ability to capture ideas instantly and sync them across all devices is a game-changer for my productivity.&quot;
                    </blockquote>
                    <div className="mt-8 flex items-center gap-4">
                        <div
                            className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/20 bg-white/10 bg-cover bg-center"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5muylo3iBxG91BqrIedUQdjmlCEvyeyZC4cRrJwKrI6hXa5sFB8ku6Nn-eREtd_cQhAilKCu1P0YJXjNreh_SiK22_G9OhMJczZsMX340iNV43rPkh7pukkO5aUNCBH9HKZ2DcIgj_rXUZVqHQpqAxcAY6UbctBESOAergPJ9BhEPfemxhiqGGeHAXskJLW_xYCpJiPnVpF-XzQrjUtlucTTVM2YAzDX_9v4MOxtgK__pn1XGaExbUSv5jJqgbEG_mkm2ZoKY06t7")' }}
                        />
                        <div>
                            <p className="text-base font-bold text-white">Sarah Chen</p>
                            <p className="text-sm font-medium text-white/70">Product Designer at Flow</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-20 bg-background-light dark:bg-background-dark overflow-y-auto">
                <AuthForm />
            </div>
        </div>
    )
}
