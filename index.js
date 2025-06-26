const cron = require('node-cron');
const { DateTime } = require('luxon');
const axios = require('axios');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const API_KEY = '30e721f371c447a1b370110f0f8f20c9';
const URL = 'https://newsapi.org/v2/everything';

const fetchNews = async () => {
	const DATE = DateTime.now().minus({ days: 1 }).toISODate();

	try {
		const response = await axios.get(URL, {
			params: {
				q: 'economy',
				from: DATE,
				sortBy: 'publishedAt',
				apiKey: API_KEY,
			},
		});

		const news = response.data.articles
			.filter((article) => article.urlToImage && article.description)
			.slice(0, 6)
			.map((article) => ({
				title: article.title,
				image: article.urlToImage,
				description: article.description,
			}));

		console.log(`[${new Date().toLocaleString()}] News fetched successfully.`);
		return news;
	} catch (error) {
		console.error('Error fetching news:', error.message);
		return { error: 'Failed to fetch news' };
	}
};

cron.schedule('0 8 * * *', async () => {
	try {
		await fetchNews();
	} catch (err) {
		console.error('Cron job error:', err.message);
	}
});

app.get('/', (req, res) => {
	res.send('Health = OK');
});

app.get('/news', async (req, res) => {
	try {
		const news = await fetchNews();
		res.json(news);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch news' });
	}
});

// (async () => {
// 	const news = await fetchNews();
// 	console.log(news);
// })();

app.listen(PORT, () => {
	console.log(`News API server is running on http://localhost:${PORT}`);
	console.log(`Health check: http://localhost:${PORT}/`);
	console.log(`News endpoint: http://localhost:${PORT}/news`);
});