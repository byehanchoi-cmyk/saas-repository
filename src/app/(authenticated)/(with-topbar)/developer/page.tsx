import { createClient } from '@/lib/supabase/server';
import { DeveloperDashboard } from '@/components/developer/DeveloperDashboard';
import { redirect } from 'next/navigation';

export default async function DeveloperPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth');
    }

    // Fetch transactions
    const { data: transactions } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Developer Center</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your API keys, webhooks, and view payment histories.</p>
                </div>
            </div>
            <DeveloperDashboard transactions={transactions || []} />
        </div>
    );
}
