import React, { useState, useEffect } from "react";
import { FaRegComment } from 'react-icons/fa';

import parse from 'html-react-parser';

import { Box, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import ReactMarkdownComponent from '@/common/components/ReactMarkdown/components';

import CustomImage from '@/common/components/CustomImage/components';
import CustomLink from '@/common/components/CustomLink/components';
import timeAgo from '@/common/utils/timeAgo';
import FavoritePostButtonComponent from '@/modules/postCard/components/favoritePostButton';
import FeelingPostButtonComponent from '@/modules/postCard/components/feelingPostButton';
import style from '@/modules/postCard/styles/style.module.scss';

import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { FaBolt, FaEllipsisH, FaFacebookF, FaHeart, FaRegHeart, FaTwitter } from 'react-icons/fa';
import { FcAssistant } from 'react-icons/fc';

import httpRequest from '@/common/utils/httpRequest';
import { getCookie } from '@/common/utils/session';

// import createDOMPurify from 'dompurify'
// import { JSDOM } from 'jsdom'

// const window = (new JSDOM('')).window
// const DOMPurify = createDOMPurify(window)

const getShortenUsername = (account) => {
    if (account.length > 12)
        return `${account.slice(0, 4)}....${account.slice(
			account.length - 5,
			account.length - 1
		)}`;
    else
        return account;
};

function removeHtmlTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string. 
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}

const PostCardComponent = ({ post }) => {

	const [content,setContent] = useState("")

    function rand(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const postContent = async (post_slug,user_name) => {
    	const [resSinglePost, resListComment] = await Promise.all([
			httpRequest.get({
				url: `/posts/${post_slug}`,
				params: {
					user_name: user_name
				},
				token: getCookie('token')
			}),
			// httpRequest.get({
			// 	url: `/comments`,
			// 	token: getCookie('token', req),
			// 	params: {
			// 		post_slug: post_slug,
			// 		offset: (1 - 1) * process.env.LIMIT_PAGE.LIST_COMMENT,
			// 		limit: process.env.LIMIT_PAGE.LIST_COMMENT
			// 	}
			// })
		]);

		console.log("the_content",resSinglePost.data.data.content);

		setContent(resSinglePost.data.data.content + "")
    }

    useEffect(() => {
    	postContent(post.slug,post.user.user_name);
  	}, []);

    return (
        <div className={`card shadow-sm ${style.post_card}`}>
			<div className="p-3">
				<div className="mb-2">
					<div className="d-flex align-items-center">
						<div className="me-1">
							<CustomLink
								href={`/u/${post.user.user_name}`}
								className="text-decoration-none d-inline-block d-flex align-items-center"
							>
								<CustomImage
									src={`${process.env.IMAGES_URL}/${post.user.avatar}`}
									className="rounded-circle h-100 w-100"
									width={33}
									height={33}
									alt={post.user.user_name}
									layout="fixed"
								/>
							</CustomLink>
						</div>
						{post.category.id == 3 && (
							<div className="d-flex position-absolute action-2">
								<div className="me-1">
									<div

										className="text-decoration-none d-inline-block d-flex align-items-center"
									>

										<span className="badge" style={{ backgroundColor: "#D78920" }}>โชคโชน (Enjoy)</span>
									</div>
								</div>
							</div>
						)}
						{post.category.id == 5 && (
							<div className="d-flex position-absolute action-2">
								<div className="me-1">
									<div

										className="text-decoration-none d-inline-block d-flex align-items-center"
									>

										<span className="badge bg-secondary">ความรู้ (Knowledge)</span>
									</div>
								</div>
							</div>
						)}
						{post.category.id == 1 && (
							<div className="d-flex position-absolute action-2">
								<div className="me-1">
									<div

										className="text-decoration-none d-inline-block d-flex align-items-center"
									>

										<span className="badge" style={{ backgroundColor: "#92D236" }}>ชิม (Taste)</span>
									</div>
								</div>
							</div>
						)}
						{post.category.id == 2 && (
							<div className="d-flex position-absolute action-2">
								<div className="me-1">
									<div

										className="text-decoration-none d-inline-block d-flex align-items-center"
									>

										<span className="badge" style={{ backgroundColor: "#FC1FA4" }}>ชอบ (Like)</span>
									</div>
								</div>
							</div>
						)}

						{post.category.id == 4 && (
							<div className="d-flex position-absolute action-2">
								<div className="me-1">
									<div

										className="text-decoration-none d-inline-block d-flex align-items-center"
									>
										<span className="badge" style={{ backgroundColor: "#1EBD43" }}>เชียวชาญ (Expertise)</span>
									</div>
								</div>
							</div>
						)}
						<div className={`d-flex position-absolute action`}>
							<OverlayTrigger
								trigger="click"
								key="options-single-user"
								placement="left"
								rootClose
								overlay={
									<Popover id={`popover-positioned-options-single-user`}>
										<Popover.Header as="h3" className="text-center">
											Mentor
										</Popover.Header>
										<Popover.Body className="p-0">
											<CustomLink href="#" className="d-flex align-items-center dropdown-item">
												✅ ผ่าน
											</CustomLink>
											<CustomLink href="#" className="d-flex align-items-center dropdown-item">
												❌ ไม่ผ่าน
											</CustomLink>
											<CustomLink href="#" className="d-flex align-items-center dropdown-item">
												📝 รายงาน
											</CustomLink>
										</Popover.Body>
									</Popover>
								}
							>
								<button type="button" className="d-flex align-items-center p-0 border-0 bg-transparent">
									<FaBolt className="me-1" />
								</button>
							</OverlayTrigger>
						</div>
						<div className="lh-1">
							<div className="d-flex align-items-center">
								<CustomLink href={`/u/${post.user.user_name}`} className="text-decoration-none text-dark">
									{post.user.name}
								</CustomLink>
							</div>
							<span className="text-muted small">{timeAgo(post.created_at)}</span>
						</div>
					</div>
				</div>
				<div className={`${style.body_post_card}`}>
					<CustomLink
						href={`/u/${post.user.user_name}/${post.slug}`}
						className={`text-decoration-none text-dark card-title mb-2 d-block ${style.title_post_card}`}
					>
						<h4 className="fw-bold mb-0" style={{
							fontSize: "32px"
						}}>{post.title}</h4>
					</CustomLink>
					<div className="mb-1">
						<p className="card-text mb-0 text-secondary excerpt">
							<div>
					        { post.excerpt.indexOf('&lt;iframe') !== -1
					            ? (
					                ""
					              )
					            : post.excerpt
					          }
					          
					          {
					          	
					          	parse(content)
					          	
					          }
					          
					      </div>
							
						</p>
					</div>
					<div className={`mb-2 ${style.tags}`}>
						{post.tags.map((tag) => (
							<CustomLink
								href={`/t/${tag.slug}`}
								key={tag.id}
								onClick={(e) => e.stopPropagation()}
								className="p-1 text-decoration-none d-inline-block tag"
							>
								<span className="tag">#
									{tag.title}</span>
							</CustomLink>
						))}
					</div>
					<div className="d-flex justify-content-end align-items-center">
						<CustomLink
							href={`/u/${post.user.user_name}/${post.slug}#comment-post`}
							className="d-flex align-items-center text-decoration-none text-secondary me-2"
						>
							<FaRegComment className="me-1" />
							<span className="me-1">{post.total_comments}</span>
							<span className="d-none d-sm-block">ความคิดเห็น</span>
						</CustomLink>
						<FavoritePostButtonComponent
							favorited={post.favorited}
							totalFavorited={post.total_favorited}
							slug={post.slug}
						/>
						{post.category.id == 1 && (
							<FeelingPostButtonComponent
								className={`btn-primary`}
								title={post.title}
								slug={post.slug}
								feeling={`ให้กำลังใจ`}
							/>
						)}
						{post.category.id == 2 && (
							<FeelingPostButtonComponent
								className={`btn-success`}
								title={post.title}
								slug={post.slug}
								feeling={`ทำต่อไป`}
							/>
						)}

						{post.category.id == 3 && (
							<FeelingPostButtonComponent
								className={`btn-warning`}
								title={post.title}
								slug={post.slug}
								feeling={`สุดยอด`}
							/>
						)}

						{post.category.id == 4 && (
							<FeelingPostButtonComponent
								className={`btn-danger`}
								title={post.title}
								slug={post.slug}
								feeling={`คารวะ`}
							/>
						)}

					</div>
				</div>
			</div>
		</div>
    );
};

export default PostCardComponent;