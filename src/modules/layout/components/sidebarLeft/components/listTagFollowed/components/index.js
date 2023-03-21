import { isEmpty } from 'lodash';
import React, { memo } from 'react';
import useSWR from 'swr';

import CustomLink from '@/common/components/CustomLink/components';
import useUser from '@/common/hooks/useUser';
import style from '@/modules/layout/components/sidebarLeft/components/listTagFollowed/styles/style.module.scss';

const ListTagFollowedComponent = () => {
	const { user } = useUser();
	// const { data: listTagFollowed } = useSWR(
	// 	user ? `/tags_followed?offset=0&limit=${process.env.LIMIT_PAGE.LIST_TAG_FOLLOWED}` : null,
	// 	{
	// 		revalidateOnFocus: false
	// 	}
	// );

	const { data: listTagFollowed } = {"success":true,"data":[],"meta":{"total":0}}

	return (
		<>
			{user &&
				(!listTagFollowed ? (
					<div className="wapper__card mb-4">
						<ul className={`list-group`}>
							<li className="loading-animation py-3 d-flex"></li>
						</ul>
					</div>
				) : (
					!isEmpty(listTagFollowed?.data) && (
						<div className="wapper__card mb-4">
							<div className="px-2 py-2">
								<h5 className="mb-0">My Tags</h5>
							</div>
							<ul className={`list-group overflow-auto ${style.height_list_group}`}>
								{listTagFollowed?.data?.map((tag) => (
									<li className="d-flex align-items-center border-0 px-2 py-2" key={tag.id}>
										<CustomLink href={`/t/${tag.slug}`} className="text-decoration-none text-dark">
											<span className="text-secondary">#</span>
											{tag.slug}
										</CustomLink>
									</li>
								))}
							</ul>
						</div>
					)
				))}
		</>
	);
};

export default memo(ListTagFollowedComponent);
