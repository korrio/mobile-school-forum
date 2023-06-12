import { isEmpty } from 'lodash';
import React, { useState } from 'react';

import httpRequest from '@/common/utils/httpRequest';
import { getCookie } from '@/common/utils/session';
import showToast from '@/common/utils/showToast';
import CommentLoopComponent from '@/modules/singlePost/components/comment/components/commentLoop';

const CommentList = ({ listCommentClient, setListCommentClient, meta, setMeta, postUserName, postSlug }) => {
	const [isLoading, setLoading] = useState(false);
	const [page, setPage] = useState(2);

	const onLoadMoreCommentClicked = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await httpRequest.get({
				url: `/comments`,
				token: getCookie('token'),
				params: {
					post_slug: postSlug,
					offset: (page - 1) * process.env.LIMIT_PAGE.LIST_COMMENT,
					limit: process.env.LIMIT_PAGE.LIST_COMMENT
				}
			});
			if (response.data.success) {
				setPage(page + 1);
				setListCommentClient(listCommentClient.concat(response.data.data));
				showToast.success(`Load more comment success`);
			}
		} catch (error) {
			showToast.error();
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{isEmpty(listCommentClient) ? (
				<div className="text-center fw-bold mt-4">
					<span>ยังไม่มีคนแสดงความคิดเห็น เริ่มแสดงความคิดเห้นได้เลยนะ</span>
				</div>
			) : (
				<>
					<CommentLoopComponent
						comments={listCommentClient}
						listCommentClient={listCommentClient}
						setListCommentClient={setListCommentClient}
						meta={meta}
						setMeta={setMeta}
						postUserName={postUserName}
						postSlug={postSlug}
					/>
					{meta.total_parent > listCommentClient.length && (
						<div className="mt-4 d-grid">
							{isLoading ? (
								<button type="submit" className="btn btn-primary btn-sm" disabled>
									<span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
									ดูเพิ่มเติม
								</button>
							) : (
								<button type="submit" className="btn btn-primary btn-sm" onClick={onLoadMoreCommentClicked}>
									ดูเพิ่มเติม
								</button>
							)}
						</div>
					)}
				</>
			)}
		</>
	);
};

export default CommentList;
