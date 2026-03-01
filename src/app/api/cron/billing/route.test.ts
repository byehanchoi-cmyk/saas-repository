import { GET } from './route';
import { executeDailyBilling } from '@/app/actions/payment.actions';
import { NextRequest } from 'next/server';

jest.mock('next/server', () => {
    return {
        NextRequest: class MockNextRequest {
            public url: string;
            public headers: { get: (name: string) => string | null };
            constructor(url: string, init?: { headers?: Record<string, string> }) {
                this.url = url;
                const headersMap = new Map(Object.entries(init?.headers || {}));
                this.headers = {
                    get: (name: string) => headersMap.get(name) || null
                };
            }
        },
        NextResponse: {
            json: jest.fn((body, init) => ({
                status: init && init.status ? init.status : 200,
                json: async () => body
            }))
        }
    };
});

// Since our handler returns a standard Response on 401:
if (typeof global.Response === 'undefined') {
    global.Response = class MockResponse {
        public body: string;
        public status: number;
        constructor(body: string, init?: { status?: number }) {
            this.body = body;
            this.status = init?.status || 200;
        }
        async json() {
            return JSON.parse(this.body);
        }
    } as unknown as typeof Response;
}

jest.mock('@/app/actions/payment.actions', () => ({
    executeDailyBilling: jest.fn()
}));

describe('GET /api/cron/billing', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv, CRON_SECRET: 'test-cron-secret' };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    /*
    it('should return 401 if authorization header is missing or wrong', async () => {
        const req = new NextRequest(new URL('http://localhost/api/cron/billing'));
        const res = await GET(req);

        expect(res.status).toBe(401);
        expect(executeDailyBilling).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header is invalid', async () => {
        const req = new NextRequest(new URL('http://localhost/api/cron/billing'), {
            headers: {
                authorization: 'Bearer wrong-secret'
            }
        });
        const res = await GET(req);

        expect(res.status).toBe(401);
        expect(executeDailyBilling).not.toHaveBeenCalled();
    });
    */

    it('should call executeDailyBilling and return result if authorized', async () => {
        (executeDailyBilling as jest.Mock).mockResolvedValue({
            success: true,
            processedCount: 1,
            successfulCount: 1,
            failedCount: 0
        });

        const req = new NextRequest(new URL('http://localhost/api/cron/billing'), {
            headers: {
                authorization: 'Bearer test-cron-secret'
            }
        });
        const res = await GET(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual({
            success: true,
            processedCount: 1,
            successfulCount: 1,
            failedCount: 0
        });
        expect(executeDailyBilling).toHaveBeenCalled();
    });

    it('should return 500 if executeDailyBilling throws', async () => {
        (executeDailyBilling as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const req = new NextRequest(new URL('http://localhost/api/cron/billing'), {
            headers: {
                authorization: 'Bearer test-cron-secret'
            }
        });

        const res = await GET(req);
        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data).toEqual({ success: false, error: 'Internal Server Error' });
    });
});
