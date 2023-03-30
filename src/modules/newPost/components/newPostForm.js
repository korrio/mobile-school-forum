import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useSWR from 'swr';
import * as Yup from 'yup';

import CustomImage from '@/common/components/CustomImage/components';
import ImagePostForm from '@/common/components/ImagePostForm/components';
import InputForm from '@/common/components/InputForm/components';
import ReactMarkdownComponent from '@/common/components/ReactMarkdown/components';
import SelectForm from '@/common/components/SelectForm/components';
import TagListForm from '@/common/components/TagListForm/components';
import TextForm from '@/common/components/TextForm/components';
import httpRequest from '@/common/utils/httpRequest';
import { getCookie } from '@/common/utils/session';
import showToast from '@/common/utils/showToast';

const NewPostFormComponent = ({ isPreview }) => {
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);
	const [tags, setTag] = useState([]);
	const [errors, setErrors] = useState({});
	const [loadImg, setLoadImg] = useState(null);
	const FILE_SIZE = 2048 * 1024;
	const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

	const { data: listCategory } = useSWR(`/categories?offset=0&limit=${process.env.LIMIT_PAGE.LIST_CATEGORY}`, {
		revalidateOnFocus: false
	});

	const initialValues = {
		title: '',
		content: '',
		category_id: '',
		image: null
	};
	const validationSchema = Yup.object({
		title: Yup.string().required('Title is required').max(150, 'Title is maximum 128 characters'),
		content: Yup.string().required('Content is required').max(60000, 'Excerpt is maximum 60000 characters'),
		category_id: Yup.number().integer('Invaild category').required('Select category'),
		image: Yup.mixed()
			.test('fileSize', 'File too large', (value) => value === null || (value && value.size <= FILE_SIZE))
			.test(
				'fileFormat',
				'Unsupported Format',
				(value) => value === null || (value && SUPPORTED_FORMATS.includes(value.type))
			)
	});
	const onSubmit = async (values) => {
		try {
			setLoading(true);
			const response = await httpRequest.upload({
				url: `/posts`,
				token: getCookie('token'),
				data: {
					title: values.title,
					content: values.content,
					category_id: values.category_id,
					tags: JSON.stringify(tags)
				},
				files: {
					image: values.image
				}
			});
			if (response.data.success) {
				showToast.success('Create post success');
				router.push(`/u/${response.data.data.user.user_name}/${response.data.data.slug}`);
			}
		} catch (error) {
			console.log(error);
			showToast.error('Create post error');
			if (!error?.response?.data?.success && error?.response?.data?.error?.status === 422) {
				setErrors(error.response.data);
			}
		} finally {
			setLoading(false);
		}
	};

	const onChangeAvatar = (e, setFieldValue) => {
		try {
			console.log(e.target.files);
			let file = e.target.files[0];
			let reader = new FileReader();
			if (file) {
				reader.onloadend = () => {
					setLoadImg(reader.result);
				};
				reader.readAsDataURL(file);
				setFieldValue('image', file);
				e.target.value = null;
				showToast.info(`Load file success "${file.name}"`);
			}
		} catch (error) {
			console.log(error);
			showToast.error();
		}
	};

	const onBlurAvatar = (e, setFieldTouched) => {
		setFieldTouched('image', e.target.files[0] || null);
	};

	const onChangeRemoveImage = (setFieldValue) => {
		setFieldValue('image', null);
		setLoadImg(null);
	};

	return (
		<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
			{({ setFieldValue, setFieldTouched, errors: error, touched, values, handleChange }) => (
				<Form>
					<div className="bg-light rounded-3 shadow-sm">
						{!isPreview ? (
							<div className="p-3 p-sm-5">
								<div className="row">
									<div className="mb-3 col-md-12">
										<ImagePostForm
											label="Image (.png, .jpg, .jpeg .gif)"
											id="image"
											name="image"
											type="file"
											accept=".png, .jpg, .jpeg .gif"
											onChange={(e) => onChangeAvatar(e, setFieldValue)}
											onBlur={(e) => onBlurAvatar(e, setFieldTouched)}
											error={error.image}
											touched={touched.image}
											imageSrc={loadImg}
											imagAlt={`Image`}
											removeImage={() => onChangeRemoveImage(setFieldValue)}
										/>
									</div>
									<div className="mb-3 col-md-12">
										<InputForm label="Title" placeholder="Enter title" id="title" name="title" type="text" />
									</div>
									<div className="mb-3 col-md-12">
										<TagListForm
											tags={tags}
											setTag={setTag}
											errors={errors.error?.message?.tags}
											placeholder="Add up to 4 tags..."
										/>
									</div>
									<div className="mb-3 col-md-12">
										<TextForm
											rows="16"
											label="Content (Markdown)"
											placeholder="Enter content"
											id="content"
											name="content"
											type="text"
										/>
									</div>
									<div className="mb-3 col-md-12 mb-0">
										<SelectForm label="Category" name="category_id">
											<option value="">Select category</option>
											{!listCategory ? (
												<option value="">Loading...</option>
											) : isEmpty(listCategory?.data) ? (
												<option value="">Empty category</option>
											) : (
												listCategory?.data?.map((category) => (
													<option value={category.id} key={category.id}>
														{category.title}
													</option>
												))
											)}
										</SelectForm>
									</div>
								</div>
							</div>
						) : (
							<article className="wapper__card">
								{loadImg && (
									<div>
										<CustomImage
											src={loadImg}
											className="rounded-3"
											alt={``}
											layout="responsive"
											width={500}
											height={220}
										/>
									</div>
								)}
								<div className="p-3 p-sm-5">
									<div className="mb-3">
										<h1>{values.title}</h1>
									</div>
									<div className="mb-3">
										{tags.map((tag, index) => (
											<span key={index} className="p-1 text-secondary">
												<span className="text-muted">#</span>
												{tag.slug}
											</span>
										))}
									</div>
									<div className="mt-5">
										<ReactMarkdownComponent markdown={values.content} />
									</div>
								</div>
							</article>
						)}
					</div>
					<div className="text-left mt-3">
						{isLoading ? (
							<button type="submit" className="btn btn-primary" disabled>
								<span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
								Submit
							</button>
						) : (
							<button type="submit" className="btn btn-primary">
								Submit
							</button>
						)}
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default NewPostFormComponent;
