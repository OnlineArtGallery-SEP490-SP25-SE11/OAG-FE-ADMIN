import { createAxiosInstance } from '@/lib/axios';


export async function getAllUser() {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const res = await axios.get('/user/all-user');
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

export async function getAllArtwork() {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const res = await axios.get('/artwork/admin');
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

export async function getAllGallery() {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const res = await axios.get('/gallery');
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

export async function getAllTransaction() {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const res = await axios.get('/wallet/admin/transactions');
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

export async function getAllExhibitiion() {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const res = await axios.get('/exhibition/user-exhibitions');
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};