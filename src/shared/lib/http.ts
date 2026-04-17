import axios from 'axios';

const API_URL = import.meta.env.SUPABASE_URL;
const API_KEY = import.meta.env.SUPABASE_ANON_KEY;

export const http = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		apikey: API_KEY,
	},
});

http.interceptors.request.use((config) => {
	const token = localStorage.getItem('access_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.clear();
			window.location.href = '/login';
		}

		return Promise.reject(error);
	}
);