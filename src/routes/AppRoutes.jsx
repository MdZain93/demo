/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import AuthLayout from '../components/layout/AuthLayout';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/navigation/ProtectedRoute';
import RoleBasedRoute from '../components/navigation/RoleBasedRoute';
import AppLoader from '../components/common/AppLoader';

// --- Lazy Load Pages ---
// Auth
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const SessionExpiredPage = lazy(() => import('../pages/auth/SessionExpiredPage'));

// Core GRC modules
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProcurementListPage = lazy(() => import('../pages/procurement/ProcurementListPage'));
const ProcurementDetailsPage = lazy(() => import('../pages/procurement/ProcurementDetailsPage'));
const CreateProcurementPage = lazy(() => import('../pages/procurement/CreateProcurementPage'));
const VendorListPage = lazy(() => import('../pages/vendors/VendorListPage'));
const VendorProfilePage = lazy(() => import('../pages/vendors/VendorProfilePage'));
const RiskDashboardPage = lazy(() => import('../pages/risk/RiskDashboardPage'));
const ComplianceDashboardPage = lazy(() => import('../pages/compliance/ComplianceDashboardPage'));
const AuditDashboardPage = lazy(() => import('../pages/audit/AuditDashboardPage'));
const ApprovalWorkbenchPage = lazy(() => import('../pages/approvals/ApprovalWorkbenchPage'));
const ReportingCenterPage = lazy(() => import('../pages/reports/ReportingCenterPage'));
const NotificationCenterPage = lazy(() => import('../pages/notifications/NotificationCenterPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const LandingPage = lazy(() => import('../pages/landing/LandingPage'));
const EmployeeDirectoryPage = lazy(() => import('../pages/employees/EmployeeDirectoryPage'));

// Errors
const NotFoundPage = lazy(() => import('../pages/error/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/error/UnauthorizedPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader message="Provisioning platform resources..." />}>
      <Routes>
        {/* Root Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/session-expired" element={<SessionExpiredPage />} />
        </Route>

        {/* Protected Dashboard & GRC Core Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard (General) */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Procurement Module */}
          <Route
            path="/procurement"
            element={
              <RoleBasedRoute path="/procurement">
                <ProcurementListPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/procurement/create"
            element={
              <RoleBasedRoute path="/procurement/create">
                <CreateProcurementPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/procurement/:id"
            element={
              <RoleBasedRoute path="/procurement">
                <ProcurementDetailsPage />
              </RoleBasedRoute>
            }
          />

          {/* Vendor Governance Module */}
          <Route
            path="/vendors"
            element={
              <RoleBasedRoute path="/vendors">
                <VendorListPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <RoleBasedRoute path="/vendors">
                <VendorProfilePage />
              </RoleBasedRoute>
            }
          />

          {/* Risk Module */}
          <Route
            path="/risk"
            element={
              <RoleBasedRoute path="/risk">
                <RiskDashboardPage />
              </RoleBasedRoute>
            }
          />

          {/* Compliance Module */}
          <Route
            path="/compliance"
            element={
              <RoleBasedRoute path="/compliance">
                <ComplianceDashboardPage />
              </RoleBasedRoute>
            }
          />

          {/* Audit Module */}
          <Route
            path="/audit"
            element={
              <RoleBasedRoute path="/audit">
                <AuditDashboardPage />
              </RoleBasedRoute>
            }
          />

          {/* Approval Workbench */}
          <Route
            path="/approvals"
            element={
              <RoleBasedRoute path="/approvals">
                <ApprovalWorkbenchPage />
              </RoleBasedRoute>
            }
          />

          {/* Reporting Center */}
          <Route
            path="/reports"
            element={
              <RoleBasedRoute path="/reports">
                <ReportingCenterPage />
              </RoleBasedRoute>
            }
          />

          {/* Notifications Center */}
          <Route path="/notifications" element={<NotificationCenterPage />} />

          {/* User Settings */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Employee Directory — Admin & Manager only */}
          <Route
            path="/employees"
            element={
              <RoleBasedRoute path="/employees">
                <EmployeeDirectoryPage />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Global Error Boundaries */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
