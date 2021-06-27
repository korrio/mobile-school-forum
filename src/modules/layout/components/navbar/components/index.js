import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import { FaTags } from 'react-icons/fa';
import { FcAbout, FcContacts, FcFaq, FcHome } from 'react-icons/fc';

import CustomImage from '@/common/components/CustomImage/components';
import useUser from '@/common/hooks/useUser';
import httpRequest from '@/common/utils/httpRequest';
import { getCookie, removeCookie } from '@/common/utils/session';
import showToast from '@/common/utils/showToast';

const NavBarComponent = () => {
	const router = useRouter();
	const { user } = useUser();

	const onLogoutClick = async (e) => {
		e.preventDefault();
		try {
			const response = await httpRequest.get({
				url: `/current_user/logout`,
				token: getCookie('token')
			});
			if (response.data.success) {
				removeCookie('token');
				showToast.success('Logout success');
				router.push('/login');
			}
		} catch (error) {
			console.log(error.response);
			showToast.error();
		}
	};

	return (
		<Navbar collapseOnSelect expand="md" bg="light" variant="light" fixed="top" className="shadow-sm">
			<div className="container-xl">
				<Link href="/" passHref>
					<Navbar.Brand className="d-flex align-items-center mr-auto">
						<CustomImage
							className="rounded-circle"
							src={`${process.env.IMAGES_URL}/6666666666.jpg`}
							width={44}
							height={44}
							alt="Logo"
						/>
						<div className="ml-2">De4thZone</div>
					</Navbar.Brand>
				</Link>
				{user && (
					<Dropdown as={NavItem} className="d-block d-md-none">
						<Dropdown.Toggle as={NavLink} id="dropdown-res" className="d-flex align-items-center text-secondary">
							<CustomImage
								className="rounded-circle"
								src={`${process.env.IMAGES_URL}/${user?.avatar}`}
								width={40}
								height={40}
								alt={user?.user_name}
							/>
							{/* <div className="ml-2 d-none d-sm-block">{user?.user_name}</div> */}
						</Dropdown.Toggle>
						<Dropdown.Menu align="right" className="p-0">
							<Link href={`/u/${user?.user_name}`} passHref>
								<Dropdown.Item>Profile</Dropdown.Item>
							</Link>
							<Link href={`/dashboard`} passHref>
								<Dropdown.Item>Dashboard</Dropdown.Item>
							</Link>
							<Dropdown.Divider className="m-0" />
							<Dropdown.Item onClick={onLogoutClick}>Logout</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				)}
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto ml-0 ml-md-3 mt-2 mt-md-0">
						<form className="form-inline">
							<input placeholder="Search" type="text" className="form-control w-100" />
						</form>
					</Nav>
					<Nav className="align-items-md-center">
						<Dropdown as={NavItem}>
							<Dropdown.Toggle as={NavLink} id="dropdown-locale">
								{router.locale === 'vi' ? 'Vietnamese' : 'English'}
							</Dropdown.Toggle>
							<Dropdown.Menu align="right" className="p-0">
								<Link href={router.asPath} locale="en" passHref>
									<Dropdown.Item>English</Dropdown.Item>
								</Link>
								<Link href={router.asPath} locale="vi" passHref>
									<Dropdown.Item>Vietnamese</Dropdown.Item>
								</Link>
							</Dropdown.Menu>
						</Dropdown>
						{user && (
							<>
								<Nav.Item>
									<Link href="/new" passHref>
										<Nav.Link>New Post</Nav.Link>
									</Link>
								</Nav.Item>
								<Dropdown as={NavItem} className="d-none d-md-block">
									<Dropdown.Toggle as={NavLink} id="dropdown-custom-2" className="d-flex align-items-center">
										<CustomImage
											className="rounded-circle"
											src={`${process.env.IMAGES_URL}/${user?.avatar}`}
											width={40}
											height={40}
											alt={user?.user_name}
										/>
										<div className="ml-2 d-none d-xl-block">{user?.user_name}</div>
									</Dropdown.Toggle>
									<Dropdown.Menu align="right" className="p-0">
										<Link href={`/u/${user?.user_name}`} passHref>
											<Dropdown.Item>Profile</Dropdown.Item>
										</Link>
										<Link href={`/dashboard`} passHref>
											<Dropdown.Item>Dashboard</Dropdown.Item>
										</Link>
										<Dropdown.Divider className="m-0" />
										<Dropdown.Item onClick={onLogoutClick}>Logout</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</>
						)}
						{!user && (
							<>
								<Nav.Item>
									<Link href="/register" passHref>
										<Nav.Link>Register</Nav.Link>
									</Link>
								</Nav.Item>
								<Nav.Item>
									<Link href="/login" passHref>
										<Nav.Link>Login</Nav.Link>
									</Link>
								</Nav.Item>
							</>
						)}
						<Dropdown as={NavItem} className="d-block d-md-none">
							<Dropdown.Toggle as={NavLink} id="dropdown-custom-5">
								Options
							</Dropdown.Toggle>
							<Dropdown.Menu align="right" className="p-0">
								<Link href="/" passHref>
									<Dropdown.Item className="d-flex align-items-center">
										<FcHome className="h5 mb-0 mr-1" /> Home
									</Dropdown.Item>
								</Link>
								<Link href="/tags" passHref>
									<Dropdown.Item className="d-flex align-items-center">
										<FaTags className="h5 mb-0 mr-1" /> Tags
									</Dropdown.Item>
								</Link>
								<Link href="/about" passHref>
									<Dropdown.Item className="d-flex align-items-center">
										<FcAbout className="h5 mb-0 mr-1" /> About
									</Dropdown.Item>
								</Link>
								<Link href="/faq" passHref>
									<Dropdown.Item className="d-flex align-items-center">
										<FcFaq className="h5 mb-0 mr-1" /> FAQ
									</Dropdown.Item>
								</Link>
								<Link href="/contact" passHref>
									<Dropdown.Item className="d-flex align-items-center">
										<FcContacts className="h5 mb-0 mr-1" /> Contact
									</Dropdown.Item>
								</Link>
							</Dropdown.Menu>
						</Dropdown>
					</Nav>
				</Navbar.Collapse>
			</div>
		</Navbar>
	);
};

export default NavBarComponent;
