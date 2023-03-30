const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase) => {
	// when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
	const isDev = phase === PHASE_DEVELOPMENT_SERVER;
	// when `next build` or `npm run build` is used
	const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
	// when `next build` or `npm run build` is used
	const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

	console.log(`isDev:${isDev} isProd:${isProd} isStaging:${isStaging}`);

	const env = {
		WEBSITE_URL: (() => {
			if (isDev) return 'http://localhost:3000';
			if (isProd) {
				return 'https://sb-inspector-forum-korrio.vercel.app/';
			}
			if (isStaging) return 'https://sb-forum-frontend.vercel.app';
			return 'RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)';
		})(),
		API_URL: (() => {
			if (isDev) return 'https://api.socialbureau.io/api';
			if (isProd) return 'https://api.socialbureau.io/api';
			if (isStaging) return 'https://api.socialbureau.io/api';
			return 'RESTURL_SESSIONS:not (isDev,isProd && !isStaging,isProd && isStaging)';
		})(),
		IMAGES_URL: (() => {
			if (isDev) return 'https://api.socialbureau.io/images-local';
			if (isProd) return 'https://api.socialbureau.io/images';
			if (isStaging) return 'https://api.socialbureau.io/images';
			return 'RESTURL_SESSIONS:not (isDev,isProd && !isStaging,isProd && isStaging)';
		})(),
		LIMIT_PAGE: {
			LIST_POST_HOME: 10,
			LIST_POST_TAG: 10,
			LIST_POST_CATEGORY: 10,
			LIST_POST_USER: 10,
			LIST_POST_FAVORITED: 10,
			LIST_TAG: 20,
			LIST_TAG_FOLLOWED: 20,
			LIST_CATEGORY: 20,
			LIST_COMMENT: 5
		},
		REQUEST: {
			TIMEOUT: 30000
		},
		IMAGES: {
			DEFAULT_IMAGE_AVATAR: 'default_avatar.png'
		},
		META: {
			TITLE: 'Social Bureau Forum',
			DESCRIPTION: 'A social network for crime inspectors.',
			TWITTER: '@socialbureau_',
			IMAGE: 'libeyondea-background-night.png'
		}
	};
	return {
		env,
		reactStrictMode: true,
		images: {
			domains: ['localhost', 'api.socialbureau.io','socialbureau.io']
		},
		i18n: {
			locales: ['en', 'th'],
			defaultLocale: 'en',
			localeDetection: false
		}
	};
};
