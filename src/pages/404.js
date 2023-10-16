import Head from 'next/head';
import React from 'react';

import LayoutComponent from '@/modules/layout/components';

const Error404 = () => {
	return (
		<>
			<Head>
				<title>404</title>
			</Head>
			<LayoutComponent>
				<div className="notfound min-vh-100 d-flex flex-row align-items-center">
					<div className="container">
						<div className="row justify-content-center">
							<div className="col-md-12 text-center">
								{/*<span className="display-404 d-block">404</span>*/}
								<img src="./images/logo.png" />
								<div className="mb-4 lead">กำลังกลับไปหน้าแรกครับ</div>
								<a href="/" className="btn-link">
									Back to Home
								</a>
							</div>
						</div>
					</div>
				</div>
			</LayoutComponent>
		</>
	);
};

export default Error404;
