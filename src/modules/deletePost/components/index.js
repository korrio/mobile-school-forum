import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import CustomLink from '@/common/components/CustomLink/components';
import LoadingSpinnerComponent from '@/common/components/LoadingSpinner/components';
import useUser from '@/common/hooks/useUser';
import httpRequest from '@/common/utils/httpRequest';
import { getCookie } from '@/common/utils/session';
import showToast from '@/common/utils/showToast';

const DeletePostComponent = ({ deletePost }) => {
	const { user } = useUser();
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		router.prefetch('/dashboard/posts');
	}, [router]);

	const onDeletePostClicked = async (e) => {
		e.preventDefault();
		try {
			if (window.confirm('Do you want to delete?')) {
				setLoading(true);
				const response = await httpRequest.delete({
					url: `/posts/${deletePost.data.slug}`,
					token: getCookie('token')
				});
				if (response.data.success) {
					showToast.success(`Delete post success`);
					router.push(`/dashboard/posts`);
				}
			}
		} catch (error) {
			showToast.error('Delete post error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container-xl py-4">
			{!user ? (
				<LoadingSpinnerComponent />
			) : (
				<div className="row">
					<div className="col-md-8 mx-auto">
						<div className="wapper__card bg-light rounded-16 shadow-sm p-3 p-sm-5">{deletePost.data.title}</div>
					</div>
					<div className="col-md-10 mx-auto">
						<div className="wapper__card bg-light rounded-16 shadow-sm p-3 p-sm-5">
							<h4 className="mb-4">Are you sure you want to delete this post?</h4>
							<div>
								{isLoading ? (
									<button type="submit" className="btn btn-danger me-2" disabled>
										<span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
										Delete
									</button>
								) : (
									<button type="submit" className="btn btn-danger me-2" onClick={onDeletePostClicked}>
										Delete
									</button>
								)}
								<CustomLink
									className="btn btn-secondary"
									href={`/u/${deletePost.data.user.user_name}/${deletePost.data.slug}/edit`}
								>
									Edit
								</CustomLink>
								<CustomLink className="btn btn-light ms-2" href={`/dashboard/posts`}>
									Cancel
								</CustomLink>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DeletePostComponent;
