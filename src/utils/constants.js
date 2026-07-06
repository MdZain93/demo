/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DEPARTMENTS = [
  'IT',
  'Finance',
  'Human Resources',
  'Procurement',
  'Legal',
  'Operations',
  'Facilities',
  'Sales',
  'Marketing'
];

export const CATEGORIES = [
  'IT Software',
  'IT Cloud Services',
  'Operations',
  'Human Resources',
  'Facilities',
  'Finance',
  'Legal'
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

export const COMPLIANCE_STATUSES = ['Compliant', 'Non-Compliant', 'Under Review'];

export const VENDOR_STATUSES = ['Active', 'Pending', 'Inactive', 'Suspended'];

export const REQUEST_STATUSES = [
  'Draft',
  'Submitted',
  'Pending Approval',
  'Approved',
  'Rejected',
  'Send Back',
  'Completed'
];

export const ROLE_PERMISSIONS = {
  Employee: ['/dashboard', '/procurement', '/notifications', '/settings'],
  'Procurement Manager': [
    '/dashboard',
    '/procurement',
    '/vendors',
    '/approvals',
    '/reports',
    '/notifications',
    '/settings',
    '/employees'
  ],
  'Compliance Officer': [
    '/dashboard',
    '/vendors',
    '/risk',
    '/compliance',
    '/reports',
    '/notifications',
    '/settings'
  ],
  Auditor: ['/dashboard', '/audit', '/reports', '/notifications', '/settings'],
  Administrator: [
    '/dashboard',
    '/procurement',
    '/vendors',
    '/risk',
    '/compliance',
    '/audit',
    '/approvals',
    '/reports',
    '/notifications',
    '/settings',
    '/employees'
  ]
};
