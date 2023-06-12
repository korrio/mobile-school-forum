import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import useUser from '@/common/hooks/useUser';
import httpRequest from '@/common/utils/httpRequest';
import { getCookie } from '@/common/utils/session';
import showToast from '@/common/utils/showToast';

const FavoritePostButtonComponent = ({ favorited, slug, totalFavorited }) => {
	const { user } = useUser();
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);
	const [isFavorited, setFavorited] = useState(favorited);
	const [sumFavorited, setSumFavorited] = useState(totalFavorited);

	const onFavoritePostClick = async (e) => {
		e.preventDefault();
		try {
			if (!user) {
				router.push('/login');
			} else {
				setLoading(true);
				const response = isFavorited
					? await httpRequest.delete({
							url: `/favorite_post`,
							params: {
								slug: slug
							},
							token: getCookie('token')
					  })
					: await httpRequest.post({
							url: `/favorite_post`,
							data: {
								slug: slug
							},
							token: getCookie('token')
					  });
				if (response.data.success) {
					setFavorited(!isFavorited);
					setSumFavorited(!isFavorited ? sumFavorited + 1 : sumFavorited - 1);
					showToast.success(`${!isFavorited ? 'ถูกใจ' : 'เลิกถูกใจ '}`, slug);
				}
			}
		} catch (error) {
			showToast.error();
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			className={`d-flex align-items-center border-0 bg-transparent ${isFavorited ? 'text-danger' : 'text-secondary'} ${
				isLoading ? 'disabled' : ''
			}`}
			onClick={onFavoritePostClick}
		>
			{isFavorited ? (
				<>
					<FaHeart className="me-1" />
				</>
			) : (
				<>
					<FaRegHeart className="me-1" />
				</>
			)}
			<span className="me-1">{sumFavorited}</span>
			<span className="d-none d-sm-block">ถูกใจ</span>
		</button>
	);
};

export default FavoritePostButtonComponent;
