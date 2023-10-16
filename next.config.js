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
		LIFF_ID: process.env.LIFF_ID,
		WEBSITE_URL: (() => {
			if (isDev) return 'http://localhost:3000';
			if (isProd) {
				return 'https://mobile-school-forum.vercel.app';
			}
			if (isStaging) return 'https://mobile-school-forum.vercel.app';
			return 'RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)';
		})(),
		API_URL: (() => {
			// if (isDev) return 'https://cdn.mobileschool.online/api';
			// if (isProd) return 'https://cdn.mobileschool.online/api';
			// if (isStaging) return 'https://cdn.mobileschool.online/api'
			if (isDev) return 'https://api-mobile-school-forum.vercel.app/api';
			// if (isDev) return 'http://localhost:8000/api';
			if (isProd) return 'https://api-mobile-school-forum.vercel.app/api';
			if (isStaging) return 'https://api-mobile-school-forum.vercel.app/api';
			return 'RESTURL_SESSIONS:not (isDev,isProd && !isStaging,isProd && isStaging)';
		})(),
		IMAGES_URL: (() => {
			// 			if (isDev) return 'https://cdn.mobileschool.online/public/images';
			// if (isProd) return 'https://cdn.mobileschool.online/public/images';
			// if (isStaging) return 'https://cdn.mobileschool.online/public/images';
			if (isDev) return 'https://cdn-mobile-school-forum.vercel.app/images';
			if (isProd) return 'https://cdn-mobile-school-forum.vercel.app/images';
			if (isStaging) return 'https://cdn-mobile-school-forum.vercel.app/images';
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
			TITLE: 'โรงเรียนมือถือฟอรั่ม',
			DESCRIPTION: 'สร้างโอกาสทางการศึกษาไทย',
			TWITTER: '@mobileschool',
			IMAGE: 'libeyondea-background-night.png'
		}
	};
	return {
		env,
		reactStrictMode: true,
		images: {
			domains: ['localhost', 'cdn-mobile-school-forum.vercel.app', 'cdn.mobileschool.online', 'api-mobile-school-forum.vercel.app','profile.line-scdn.net'],
			unoptimized: true,
		},
		i18n: {
			locales: ['en'],
			defaultLocale: 'en',
			localeDetection: false
		}
	};
};
