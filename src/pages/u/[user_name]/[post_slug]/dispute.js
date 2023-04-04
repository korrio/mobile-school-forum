import React from 'react';

import MetaWebsite from '@/common/meta/MetaWebsite';
import httpRequest from '@/common/utils/httpRequest';
import { getCookie } from '@/common/utils/session';
import Layout from '@/modules/layout/components';
import SinglePostDisputeComponent from '@/modules/singlePostDispute/components';

const SinglePostDispute = ({ singlePost, listPostUser, listComment }) => {
	return (
		<>
			<MetaWebsite
				title={singlePost.data.title}
				description={singlePost.data?.excerpt}
				image={singlePost.data?.image}
				ogType="article"
			/>
			<Layout>
				<SinglePostDisputeComponent singlePost={singlePost} listPostUser={listPostUser} listComment={listComment} />
			</Layout>
		</>
	);
};

export async function getServerSideProps({ req, query }) {
	try {
		const { user_name, post_slug } = query;
		const [resSinglePost, resListComment] = await Promise.all([
			httpRequest.get({
				url: `/posts/${post_slug}`,
				params: {
					user_name: user_name
				},
				token: getCookie('token', req)
			}),
			httpRequest.get({
				url: `/comments`,
				token: getCookie('token', req),
				params: {
					post_slug: post_slug,
					offset: (1 - 1) * process.env.LIMIT_PAGE.LIST_COMMENT,
					limit: process.env.LIMIT_PAGE.LIST_COMMENT
				}
			})
		]);
		if (resSinglePost.data.success && resListComment.data.success) {
			const resListPostUser = await httpRequest.get({
				url: '/posts',
				token: getCookie('token', req),
				params: {
					user: resSinglePost.data.data.user.user_name,
					sort_by: 'published_at',
					sort_direction: 'desc',
					offset: 0,
					limit: 5
				}
			});
			if (resListPostUser.data.success) {
				return {
					props: {
						singlePost: resSinglePost.data,
						listPostUser: resListPostUser.data,
						listComment: resListComment.data
					}
				};
			}
		}
	} catch (error) {
		console.log(error.response);
		return {
			notFound: true
		};
	}
}

export default SinglePostDispute;
