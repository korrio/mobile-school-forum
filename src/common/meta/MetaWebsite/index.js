import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const MetaWebsite = ({
	title,
	description = process.env.META.DESCRIPTION,
	creatorTwitter,
	image,
	ogType = 'website',
	isNoneMeta = false
}) => {
	const { asPath, locale } = useRouter();
	const canonical =
		process.env.WEBSITE_URL + `${locale !== 'en' ? `/${locale}` : ''}` + asPath.split('?')[0].split('#')[0];

	return (
		<>
			<Head>
				{isNoneMeta ? (
					<>
						<title>{title ? `${title} | ${process.env.META.TITLE}` : process.env.META.TITLE}</title>
					</>
				) : (
					<>
						<title>{title ? `${title} | ${process.env.META.TITLE}` : process.env.META.TITLE}</title>
						<meta name="description" content={description} />
						<link rel="canonical" href={canonical} />

						<meta property="og:type" content={ogType} />
						<meta property="og:url" content={canonical} />
						<meta property="og:title" content={title ? title : process.env.META.TITLE} />
						<meta property="og:description" content={description} />
						<meta property="og:site_name" content={process.env.META.TITLE} />
						<meta property="og:image" content={`/images/meta-mobile-school.jpg`} />
 
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:url" content={canonical} />
						<meta name="twitter:title" content={title ? title : process.env.META.TITLE} />
						<meta name="twitter:description" content={description} />
						<meta name="twitter:site" content={`https://twitter.com/${process.env.META.TWITTER.replace(/^@/, ``)}/`} />
						<meta
							name="twitter:image"
							content={`${process.env.IMAGES_URL}/${image ? image : process.env.META.IMAGE}`}
						/>
						{creatorTwitter && <meta name="twitter:creator" content={creatorTwitter} />}
					</>
				)}
			</Head>
		</>
	);
};

export default MetaWebsite;
