import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import * as Yup from 'yup';

import CheckboxForm from '@/common/components/CheckboxForm/components';
import CustomLink from '@/common/components/CustomLink/components';
import ImageUserForm from '@/common/components/ImageUserForm/components';
import InputForm from '@/common/components/InputForm/components';
import SelectForm from '@/common/components/SelectForm/components';
import SocialButtonLogin from '@/common/components/SocialButtonLogin/components';
import TextForm from '@/common/components/TextForm/components';
import httpRequest from '@/common/utils/httpRequest';
import { setCookie } from '@/common/utils/session';
import showToast from '@/common/utils/showToast';

const RegisterFormComponent = () => {
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);
	const [loadImg, setLoadImg] = useState('');
	const [errors, setErrors] = useState({});
	const [verify, setVerify] = useState('');
	const gender = ['', 'male', 'female', 'unknown'];
	const FILE_SIZE = 2048 * 1024;
	const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

	const initialValues = {
		first_name: '',
		last_name: '',
		user_name: '',
		email: '',
		password: '',
		password_confirm: '',
		phone_number: '',
		address: '',
		gender: '',
		avatar: null,
		biography: '',
		agreeterms: false
	};
	const validationSchema = Yup.object({
		first_name: Yup.string()
			.min(1, 'Fisrt name ต้องมีอย่างน้อย 1 ตัวอักษร')
			.max(16, 'Fisrt name สูงสุด 16 ตัวอักษร')
			.required('First name is required'),
		last_name: Yup.string()
			.min(1, 'Last name ต้องมีอย่างน้อย 1 ตัวอักษร')
			.max(16, 'Last name สูงสุด 16 ตัวอักษร')
			.required('Last name is required'),
		user_name: Yup.string()
			.min(6, 'User name ต้องมีอย่างน้อย 6 ตัวอักษร')
			.max(16, 'User name สูงสุด 16 ตัวอักษร')
			.matches(/^(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/, 'User name invalid')
			.required('User name is required'),
		email: Yup.string()
			.matches(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Email invalid'
			)
			.required('Email is required'),
		password: Yup.string().required('Password is required'),
		password_confirm: Yup.string()
			.required('Comfirm password is required')
			.oneOf([Yup.ref('password')], 'รหัสผ่านไม่ตรงกัน'),
		phone_number: Yup.string()
			.min(10, 'Phone number ต้องมีอย่างน้อย 10 ตัวอักษร')
			.matches(/^[0-9]+$/, 'Phone number invalid')
			.nullable(),
		address: Yup.string()
			.min(6, 'Address ต้องมีอย่างน้อย 6 ตัวอักษร')
			.max(66, 'Address สูงสุด 66 ตัวอักษร')
			.nullable(),
		avatar: Yup.mixed()
			.test('fileSize', 'ไฟล์ใหญ่เกินไป', (value) => value === null || (value && value.size <= FILE_SIZE))
			.test(
				'fileFormat',
				'ไฟล์ไม่รองรับ',
				(value) => value === null || (value && SUPPORTED_FORMATS.includes(value.type))
			),
		gender: Yup.string().oneOf(['male', 'female', 'unknown'], 'Gender invalid').required('โปรดระบุเพศ'),
		biography: Yup.string()
			.min(6, 'Bio อย่างน้อย 6 ตัวอักษร')
			.max(66, 'Bio สูงสุด 666 ตัวอักษร')
			.nullable(),
		agreeterms: Yup.boolean().oneOf([true], 'คุณต้องยอมรับเงื่อนไขการให้บริการ').required('Required')
	});

	const onSubmit = async (values) => {
		try {
			setLoading(true);
			const response = await httpRequest.upload({
				url: `/users/register`,
				data: {
					first_name: values.first_name,
					last_name: values.last_name,
					user_name: values.user_name,
					email: values.email,
					password: values.password,
					phone_number: values.phone_number,
					address: values.address,
					gender: values.gender,
					biography: values.biography
				},
				files: {
					avatar: values.avatar
				}
			});
			if (response.data.success) {
				setVerify(response.data.data.email);
				showToast.success('ลงทะเบียนสำเร็จแล้ว');
			}
		} catch (error) {
			showToast.error('ไม่สามารถลงทะเบียนได้ในขณะนี้');
			if (!error?.response?.data?.success) {
				setErrors(error.response.data);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSocialLogin = async (res) => {
		try {
			const user = {
				access_token: res._token.accessToken,
				provider: res._provider
			};
			setLoading(true);
			const response = await httpRequest.post({
				url: `/users/login`,
				data: user
			});
			if (response.data.success) {
				setCookie('token', response.data.data.access_token);
				showToast.success('เข้าสู่ระบบสำเร็จแล้ว');
				// router.push('/');
				router.push('/tags');
			}
		} catch (error) {
			showToast.error('ไม่สามารถเข้าสู่ระบบได้');
		} finally {
			setLoading(false);
		}
	};

	const handleSocialLoginFailure = (error) => {
		console.error(error);
		showToast.error();
	};

	const onChangeAvatar = (e, setFieldValue) => {
		try {
			let file = e.target.files[0];
			let reader = new FileReader();
			if (file) {
				reader.onloadend = () => {
					setLoadImg(reader.result);
				};
				reader.readAsDataURL(file);
				setFieldValue('avatar', file);
				e.target.value = null;
				showToast.info(`Load file success "${file.name}"`);
			}
		} catch (error) {
			console.log(error);
			showToast.error();
		}
	};

	const onBlurAvatar = (e, setFieldTouched) => {
		setFieldTouched('avatar', e.target.files[0] || null);
	};

	if (verify) {
		return (
			<div className="alert alert-success mb-0 text-dark" role="alert">
				โปรดตรวจสอบอีเมล์ของท่าน {verify}
			</div>
		);
	}

	return (
		<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
			{({ setFieldValue, setFieldTouched, errors: error, touched }) => (
				<Form>
					<h2 className="text-center mb-3">ลงทะเบียน</h2>
					<div className="row">
						<div className="mb-3 col-md-6">
							<InputForm label="ชื่อจริง" placeholder="ชื่อจริง" id="first_name" name="first_name" type="text" />
						</div>
						<div className="mb-3 col-md-6">
							<InputForm label="นามสกุล" placeholder="นามสกุล" id="last_name" name="last_name" type="text" />
						</div>
						<div className="mb-3 col-md-6">
							<InputForm
								label="Email"
								placeholder="Email"
								id="email"
								name="email"
								type="text"
								errors={errors.error?.message?.email}
							/>
						</div>
						<div className="mb-3 col-md-6">
							<InputForm
								label="ชื่อผู้ใช้งาน"
								placeholder="ชื่อผู้ใช้งาน"
								id="user_name"
								name="user_name"
								type="text"
								errors={errors.error?.message?.user_name}
							/>
						</div>
						<div className="mb-3 col-md-6">
							<InputForm label="รหัสผ่าน" placeholder="รหัสผ่าน" id="password" name="password" type="password" />
						</div>
						<div className="mb-3 col-md-6">
							<InputForm
								label="ยืนยันรหัสผ่าน"
								placeholder="ยืนยันรหัสผ่าน"
								id="password_confirm"
								name="password_confirm"
								type="password"
							/>
						</div>
						<div className="mb-3 col-md-6">
							<InputForm
								label="เบอร์โทรศัพท์มือถือ"
								placeholder="0843306010"
								id="phone_number"
								name="phone_number"
								type="text"
							/>
						</div>
						<div className="mb-3 col-md-6">
						<SelectForm label="เพศ" name="gender">
                                <option value={gender[0]}>เลือกเพศ</option>
                                <option value={gender[1]}>ชาย</option>
                                <option value={gender[2]}>หญิง</option>
                                <option value={gender[3]}>ไม่ระบุเพศ</option>
                            </SelectForm>
						</div>
						<div className="mb-3 col-md-12">
							<TextForm rows="2" label="ที่อยู่" placeholder="ที่อยู่" id="address" name="address" />
						</div>
						<div className="mb-3 col-md-12">
							<TextForm rows="3" label="ประวัติส่วนตัว" placeholder="ประวัติส่วนตัว" id="biography" name="biography" />
						</div>
						<div className="mb-3 col-md-12">
							<ImageUserForm
								label="Avatar"
								id="avatar"
								name="avatar"
								type="file"
								accept=".png, .jpg, .jpeg .gif"
								onChange={(e) => onChangeAvatar(e, setFieldValue)}
								onBlur={(e) => onBlurAvatar(e, setFieldTouched)}
								error={error.avatar}
								touched={touched.avatar}
								imageSrc={loadImg}
								imagAlt={`User avatar`}
							/>
						</div>
						<div className="mb-3 col-md-12">
							<div className="form-check">
								<CheckboxForm label="ฉันยอมรับเงื่อนไขการให้บริการ" id="agreeterms" name="agreeterms" />
							</div>
						</div>
					</div>
					<div className="text-center">
						{isLoading ? (
							<button type="submit" className="btn btn-primary" disabled>
								<span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
								ลงทะเบียน
							</button>
						) : (
							<button type="submit" className="btn btn-primary">
								ลงทะเบียน
							</button>
						)}
						<p className="mt-3">
							<CustomLink className="text-decoration-none" href="/login" as="/login">
							มีบัญชีแล้ว?
							</CustomLink>
						</p>
						{/* <p className="mt-3">or register with:</p>
						<div>
							<SocialButtonLogin
								handleSocialLogin={handleSocialLogin}
								handleSocialLoginFailure={handleSocialLoginFailure}
								provider="facebook"
							/>
						</div>
						<div>
							<SocialButtonLogin
								handleSocialLogin={handleSocialLogin}
								handleSocialLoginFailure={handleSocialLoginFailure}
								provider="google"
							/>
						</div> */}
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default RegisterFormComponent;
