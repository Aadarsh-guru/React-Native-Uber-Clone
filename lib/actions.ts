import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error('API base URL not defined in environment variables');
};

export const signUpUser = async ({ name, email, clerk_id }: { name: string; email: string; clerk_id: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, clerk_id }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to sign up user');
        }
        const data = await response.json();
        return data.success;
    } catch (error: any) {
        console.log(`Error while signing up user: ${error.message}`);
        throw error;
    }
};

export const createRide = async (body: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/create-ride`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create ride');
        }
        const data = await response.json();
        return data.success;
    } catch (error: any) {
        console.log(`Error while creating ride: ${error.message}`);
        throw error;
    }
};

export const createIntent = async ({ name, email, amount }: { name: string; email: string; amount: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/create-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, amount }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create payment intent');
        }
        const data = await response.json();
        return {
            paymentIntent: data.paymentIntent,
            ephemeralKey: data.ephemeralKey,
            customer: data.customer,
        };
    } catch (error: any) {
        console.log(`Error while creating intent: ${error.message}`);
        throw error;
    }
};

export const pay = async (body: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to process payment');
        }
        const data = await response.json();
        return {
            success: data.success,
            message: data.message,
            result: data.result,
        };
    } catch (error: any) {
        console.log(`Error while processing payment: ${error.message}`);
        throw error;
    }
};

export const fetchAPI = async (url: string, options?: RequestInit) => {
    try {
        const response = await fetch(`${API_BASE_URL + url}`, options);
        if (!response.ok) {
            new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export const useFetch = <T>(url: string, options?: RequestInit) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchAPI(url, options);
            setData(result.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};