import { executeDailyBilling } from './payment.actions';
import { createClient } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(),
}));

describe('executeDailyBilling', () => {
    let mockSupabase: Record<string, jest.Mock | Record<string, jest.Mock>>;
    let originalFetch: typeof fetch;

    beforeEach(() => {
        jest.clearAllMocks();

        mockSupabase = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            not: jest.fn().mockReturnThis(),
            lte: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ error: null })
            }),
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        originalFetch = global.fetch;
        global.fetch = jest.fn();
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it('should fetch active subscriptions due for billing today and execute billing successfully', async () => {
        // Mock subscriptions query
        const mockSubscriptions = [
            {
                id: 'sub-1',
                user_id: 'user-1',
                billing_key: 'bkey-1',
                plan_name: 'Pro',
                status: 'active',
                current_period_end: new Date().toISOString(),
                users: { email: 'user1@example.com' },
            },
        ];

        mockSupabase.lte.mockResolvedValueOnce({
            data: mockSubscriptions,
            error: null,
        });

        // Mock fetch for Toss billing
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({
                paymentKey: 'test-payment-key-1',
                orderId: 'test-order-1',
                totalAmount: 14400,
            }),
        });

        // Mock payment_transactions insert
        mockSupabase.insert.mockResolvedValueOnce({ error: null });

        // Mock subscription update
        // (Handled by global mock)

        const result = await executeDailyBilling();

        // 1. Check if subscriptions were fetched correctly
        expect(mockSupabase.from).toHaveBeenCalledWith('subscriptions');
        expect(mockSupabase.select).toHaveBeenCalledWith('*, users!inner(email)');
        expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'active');
        expect(mockSupabase.not).toHaveBeenCalledWith('billing_key', 'is', null);
        expect(mockSupabase.lte).toHaveBeenCalledWith('current_period_end', expect.any(String));

        // 2. Check if Toss Payments API was called
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.tosspayments.com/v1/billing/bkey-1',
            expect.objectContaining({
                method: 'POST',
                headers: expect.any(Object),
                body: expect.stringContaining('"customerKey":"user-1"'),
            })
        );

        // 3. Check if we inserted a payment transaction
        expect(mockSupabase.from).toHaveBeenCalledWith('payment_transactions');
        expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
            user_id: 'user-1',
            status: 'SUCCESS',
            payment_key: 'test-payment-key-1',
            amount: 14400,
        }));

        // 4. Check if we updated the subscription
        expect(mockSupabase.from).toHaveBeenCalledWith('subscriptions');
        expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
            current_period_end: expect.any(String),
        }));

        expect(result).toEqual({
            success: true,
            processedCount: 1,
            successfulCount: 1,
            failedCount: 0,
        });
    });

    it('should handle API errors and record failed transaction', async () => {
        const mockSubscriptions = [
            {
                id: 'sub-failed',
                user_id: 'user-fail',
                billing_key: 'bkey-fail',
                plan_name: 'Pro',
                status: 'active',
                current_period_end: new Date().toISOString(),
                users: { email: 'fail@example.com' },
            },
        ];

        mockSupabase.lte.mockResolvedValueOnce({
            data: mockSubscriptions,
            error: null,
        });

        // Mock fetch failure
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            text: jest.fn().mockResolvedValue('{"message": "Not enough balance"}'),
        });

        // Mock payment_transactions insert for FAILED
        mockSupabase.insert.mockResolvedValueOnce({ error: null });

        // Mock subscription update (status to past_due)
        // (Handled by global mock)

        const result = await executeDailyBilling();

        expect(global.fetch).toHaveBeenCalledWith('https://api.tosspayments.com/v1/billing/bkey-fail', expect.any(Object));

        // Check failed transaction record
        expect(mockSupabase.from).toHaveBeenCalledWith('payment_transactions');
        expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
            user_id: 'user-fail',
            status: 'FAILED',
            fail_reason: 'Not enough balance',
        }));

        // Check if subscription was marked as past_due
        expect(mockSupabase.from).toHaveBeenCalledWith('subscriptions');
        expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
            status: 'past_due',
        }));

        expect(result).toEqual({
            success: true,
            processedCount: 1,
            successfulCount: 0,
            failedCount: 1,
        });
    });
});
