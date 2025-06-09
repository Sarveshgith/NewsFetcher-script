const cron = require('node-cron');
const { DateTime } = require('luxon');
const axios = require('axios');

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
		// console.log(news); // You can remove or store it instead
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

// (async () => {
// 	const news = await fetchNews();
// 	console.log(news);
// })();