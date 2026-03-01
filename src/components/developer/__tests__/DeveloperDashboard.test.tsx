import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeveloperDashboard } from '../DeveloperDashboard';

describe('DeveloperDashboard', () => {
    const mockTransactions = [
        {
            id: 'tx-1',
            order_id: 'order-123',
            order_name: 'Pro Plan',
            amount: 14400,
            status: 'SUCCESS',
            created_at: new Date('2026-03-01T12:00:00Z').toISOString()
        },
        {
            id: 'tx-2',
            order_id: 'order-124',
            order_name: 'Pro Plan',
            amount: 14400,
            status: 'FAILED',
            fail_reason: 'Not enough balance',
            created_at: new Date('2026-03-02T12:00:00Z').toISOString()
        }
    ];

    it('renders tabs correctly', () => {
        render(<DeveloperDashboard transactions={mockTransactions} />);

        expect(screen.getByText('결제 내역 (Payments)')).toBeInTheDocument();
        expect(screen.getByText('API 키 (API Keys)')).toBeInTheDocument();
        expect(screen.getByText('웹훅 (Webhooks)')).toBeInTheDocument();
        expect(screen.getByText('API 로그 (API Logs)')).toBeInTheDocument();
    });

    it('displays transactions in the payments tab by default', () => {
        render(<DeveloperDashboard transactions={mockTransactions} />);

        // Check if the order names show up
        expect(screen.getAllByText('Pro Plan').length).toBe(2);

        // Statuses
        expect(screen.getByText('SUCCESS')).toBeInTheDocument();
        expect(screen.getByText('FAILED')).toBeInTheDocument();
        expect(screen.getByText('Not enough balance')).toBeInTheDocument();
    });

    it('shows empty state when no transactions exist', () => {
        render(<DeveloperDashboard transactions={[]} />);

        expect(screen.getByText('현재 기록된 결제 내역이 없습니다.')).toBeInTheDocument();
    });

    it('switches to API Keys tab when clicked', () => {
        render(<DeveloperDashboard transactions={mockTransactions} />);

        const keysTabBtn = screen.getByText('API 키 (API Keys)');
        fireEvent.click(keysTabBtn);

        // Now API Keys content should be visible
        expect(screen.getByText('내 API 키')).toBeInTheDocument();
        expect(screen.getByDisplayValue('test_ck_mocked_value_for_sandbox')).toBeInTheDocument();
    });

    it('switches to Webhooks tab when clicked', () => {
        render(<DeveloperDashboard transactions={mockTransactions} />);

        const webhooksTabBtn = screen.getByText('웹훅 (Webhooks)');
        fireEvent.click(webhooksTabBtn);

        expect(screen.getByText('새 웹훅 추가하기')).toBeInTheDocument();
    });

    it('switches to Logs tab when clicked', () => {
        render(<DeveloperDashboard transactions={mockTransactions} />);

        const logsTabBtn = screen.getByText('API 로그 (API Logs)');
        fireEvent.click(logsTabBtn);

        expect(screen.getByText('API 연동 실시간 로그')).toBeInTheDocument();
        expect(screen.getByText('/v1/billing/authorizations/issue')).toBeInTheDocument();
    });
});
