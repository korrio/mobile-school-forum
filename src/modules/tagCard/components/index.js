import React from 'react';

import CustomLink from '@/common/components/CustomLink/components';
import FollowTagButtonComponent from '@/modules/tagCard/components/followTagButton';
import style from '@/modules/tagCard/styles/style.module.scss';

const TagCardComponent = ({ tag, classNameContainer = '', isSingle = false }) => {
	if (!tag) return null;
	return (
		<div className={`card shadow-sm ${style.tag_card} ${classNameContainer} ${!isSingle ? 'h-100' : ''}`}>
			<div className="p-3">
				<div className={`${style.body_tag_card}`}>
					{isSingle ? (
						<h1 className="card-title mb-2 text-dark">
							<span className="text-secondary">#</span>
							{tag.title}
						</h1>
					) : (
						<CustomLink
							href={`/t/${tag.slug}`}
							className={`card-title text-decoration-none d-block mb-2 text-dark ${style.title_tag_card}`}
						>
							<h5 className="fw-bold mb-0">
								<span className="text-secondary">#</span>
								{tag.title}
							</h5>
						</CustomLink>
					)}
					<div className="mb-1">
						<p className="card-text">{tag.content}</p>
					</div>
					<div className="mb-2">
						<span className="text-muted small">{tag.total_posts} เผยแพร่ผลงาน</span>
					</div>
					<div className="d-flex justify-content-end">
						<FollowTagButtonComponent slug={tag?.slug} following={tag?.following} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default TagCardComponent;
