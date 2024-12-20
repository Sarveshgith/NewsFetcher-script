const { DateTime } = require('luxon');
const axios = require('axios');

const API_KEY = '30e721f371c447a1b370110f0f8f20c9';
const URL = 'https://newsapi.org/v2/everything';
const DATE = DateTime.now().minus({ days: 1 }).toISODate();

const fetchNews = async () => {
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
			.slice(0, 3)
			.map((article) => ({
				title: article.title,
				image: article.urlToImage,
				description: article.description,
			}));

		return news;
	} catch (error) {
		console.error('Error fetching news:', error.message);
		return { error: 'Failed to fetch news' };
	}
};

fetchNews().then((news) => console.log(news));
