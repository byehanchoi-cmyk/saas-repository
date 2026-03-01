import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkout } from '../Checkout';
import * as TossPaymentsSdk from '@tosspayments/tosspayments-sdk';

// Mock the tossing SDK
jest.mock('@tosspayments/tosspayments-sdk', () => ({
    loadTossPayments: jest.fn(),
}));

describe('Checkout Component', () => {
    const mockRenderPaymentMethods = jest.fn();
    const mockRenderAgreement = jest.fn();
    const mockSetAmount = jest.fn();
    const mockRequestPayment = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        const mockWidgets = {
            setAmount: mockSetAmount,
            renderPaymentMethods: mockRenderPaymentMethods,
            renderAgreement: mockRenderAgreement,
            requestPayment: mockRequestPayment,
        };

        const mockTossPayments = {
            widgets: jest.fn().mockReturnValue(mockWidgets),
        };

        (TossPaymentsSdk.loadTossPayments as jest.Mock).mockResolvedValue(mockTossPayments);
    });

    it('renders payment UI placeholders and loads TossPayments SDK on mount', async () => {
        render(
            <Checkout
                clientKey="test_ck_xxxx"
                customerKey="guest"
                amount={15000}
                orderName="토스 티셔츠 외 2건"
            />
        );

        expect(screen.getByTestId('payment-method')).toBeInTheDocument();
        expect(screen.getByTestId('agreement')).toBeInTheDocument();

        await waitFor(() => {
            expect(TossPaymentsSdk.loadTossPayments).toHaveBeenCalledWith('test_ck_xxxx');
            expect(mockSetAmount).toHaveBeenCalledWith({
                currency: 'KRW',
                value: 15000,
            });
            expect(mockRenderPaymentMethods).toHaveBeenCalledWith({
                selector: '#payment-method',
                variantKey: 'DEFAULT',
            });
            expect(mockRenderAgreement).toHaveBeenCalledWith({
                selector: '#agreement',
                variantKey: 'AGREEMENT',
            });
        });
    });

    it('calls requestPayment with correct parameters when checkout button is clicked', async () => {
        render(
            <Checkout
                clientKey="test_ck_xxxx"
                customerKey="user123"
                amount={15000}
                orderName="토스 티셔츠 외 2건"
                customerEmail="test@example.com"
                customerName="김토스"
            />
        );

        // Wait for initialization to complete to enable button
        const button = screen.getByRole('button', { name: /결제하기/i });
        await waitFor(() => {
            expect(button).not.toBeDisabled();
        });

        await userEvent.click(button);

        // Check if requestPayment was called
        expect(mockRequestPayment).toHaveBeenCalledWith(
            expect.objectContaining({
                orderId: expect.any(String),
                orderName: '토스 티셔츠 외 2건',
                customerName: '김토스',
                customerEmail: 'test@example.com',
                successUrl: expect.stringContaining('/payment/success'),
                failUrl: expect.stringContaining('/payment/fail'),
            })
        );
    });
});
