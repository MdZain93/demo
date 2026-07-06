/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address')
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('New Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export const procurementRequestSchema = yup.object().shape({
  title: yup
    .string()
    .required('Request Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  vendor: yup
    .string()
    .required('Vendor is required'),
  category: yup
    .string()
    .required('Category is required'),
  amount: yup
    .number()
    .typeError('Amount must be a valid number')
    .required('Total Amount is required')
    .positive('Amount must be greater than zero'),
  priority: yup
    .string()
    .required('Priority is required'),
  requiredDate: yup
    .string()
    .required('Required Date is required'),
  description: yup
    .string()
    .required('Justification / Description is required')
    .min(10, 'Please provide at least 10 characters of detail')
});

export const approvalCommentSchema = yup.object().shape({
  comment: yup
    .string()
    .required('Please provide a comment justifying your approval/rejection action')
    .min(5, 'Comments must be at least 5 characters')
});

export const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email'),
  department: yup
    .string()
    .required('Department is required')
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
});
