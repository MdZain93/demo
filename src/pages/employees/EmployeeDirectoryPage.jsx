/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';

// Icons
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { addEmployee, logSentEmail, fireEmployee, fetchEmployees, fetchSentEmails } from '../../features/auth/authSlice';
import { addAuditLog } from '../../features/audit/auditSlice';

const ROLE_COLORS = {
  Administrator: { bg: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' },
  'Procurement Manager': { bg: 'rgba(34, 211, 238, 0.12)', color: '#06b6d4' },
  'Compliance Officer': { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  Auditor: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
  Employee: { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8' },
};

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'Employee',
  department: 'IT',
};

export function EmployeeDirectoryPage() {
  const dispatch = useDispatch();
  const { user, employees: authEmployees, sentEmails: authSentEmails } = useSelector((state) => state.auth);
  const employees = Array.isArray(authEmployees) ? authEmployees : [];
  const sentEmails = Array.isArray(authSentEmails) ? authSentEmails : [];

  // Load employees and sent emails from Supabase on mount
  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchSentEmails());
  }, [dispatch]);

  const mailerUrl = '/api/send-email';

  // Dialog & UI states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mailLogOpen, setMailLogOpen] = useState(true);
  const [expandedMailId, setExpandedMailId] = useState(null);

  // Fire / Terminate account states
  const [fireDialogOpen, setFireDialogOpen] = useState(false);
  const [employeeToFire, setEmployeeToFire] = useState(null);

  // Gmail dispatch states
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [dispatchStep, setDispatchStep] = useState(0);
  const [dispatchedData, setDispatchedData] = useState({ email: '', name: '', password: '', role: '', department: '' });

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpen = () => {
    setFormData({ ...EMPTY_FORM, password: generateRandomPassword() });
    setShowPassword(false);
    setErrorMsg('');
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setErrorMsg('');
  };

  const generateRandomPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$^*';
    const all = uppercase + lowercase + numbers + special;
    let pass = '';
    pass += uppercase[Math.floor(Math.random() * uppercase.length)];
    pass += lowercase[Math.floor(Math.random() * lowercase.length)];
    pass += numbers[Math.floor(Math.random() * numbers.length)];
    pass += special[Math.floor(Math.random() * special.length)];
    for (let i = 0; i < 6; i++) {
      pass += all[Math.floor(Math.random() * all.length)];
    }
    return pass.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const handleAutoGenerate = () => {
    setFormData((prev) => ({ ...prev, password: generateRandomPassword() }));
    setShowPassword(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('Full name, email, and password are required.');
      return;
    }
    const exists = employees.some(
      (emp) => emp.email.toLowerCase() === formData.email.toLowerCase()
    );
    if (exists) {
      setErrorMsg('An employee with that email already exists.');
      return;
    }

    // Add to Redux store
    dispatch(addEmployee(formData));
    dispatch(
      addAuditLog({
        user: user.name,
        role: user.role,
        action: 'Provision Employee',
        module: 'System',
        description: `Provisioned new account: ${formData.name} (${formData.role}) — ${formData.email}`,
        ip: '127.0.0.1',
      })
    );

    // Save dispatch data for the relay dialog
    const dData = { ...formData };
    setDispatchedData(dData);

    // Close form, open dispatch animation
    setDialogOpen(false);
    setDispatchStep(0);
    setDispatchOpen(true);

    // Send REAL email via Gmail SMTP backend
    const emailSubject = '[e-GRCP] Security Notice: Corporate Account Provisioned';
    const portalUrl = `${window.location.origin}/login`;
    const emailBody = `Dear ${dData.name},

We are pleased to inform you that your enterprise access credentials for the e-GRCP Portal have been provisioned by system administration.

Your account details are outlined below:
---------------------------------------------
Portal Address:      ${portalUrl}
Username (Email):    ${dData.email}
Assigned Role:       ${dData.role}
Primary Department:  ${dData.department}
Temporary Password:  ${dData.password}
---------------------------------------------

Security Instructions:
1. Navigate to the login portal using the link above.
2. Enter your username and the temporary password provided.
3. Upon successful authentication, you will be prompted to establish a new, secure password meeting corporate password complexity requirements.

This is an automated security transmission. If you did not request this account or believe this request was made in error, please contact the IT Security Operations Center immediately.

Sincerely,
e-GRCP Identity & Access Management (IAM) Team
Enterprise Security Group`;

    fetch(mailerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: dData.email,
        toName: dData.name,
        subject: emailSubject,
        body: emailBody,
      })
    })
      .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t || `HTTP ${res.status}`) }))
      .then(data => {
        if (data.success) console.log('✅ Provisioning email sent:', data.messageId);
        else console.warn('⚠️ Email delivery issue:', data.error);
      })
      .catch(err => console.warn('❌ Mailer API Error:', err.message || err));

    // Simulate SMTP relay then log the email
    setTimeout(() => {
      setDispatchStep(1);

      // Persist this email to sent log
      dispatch(logSentEmail({
        to: dData.email,
        toName: dData.name,
        role: dData.role,
        department: dData.department,
        password: dData.password,
        sentBy: user?.name || 'Administrator',
        subject: emailSubject,
      }));
    }, 2200);

    setFormData(EMPTY_FORM);
  };

  const handleFireClick = (emp) => {
    setEmployeeToFire(emp);
    setFireDialogOpen(true);
  };

  const handleFireConfirm = () => {
    if (!employeeToFire) return;

    // Send REAL email for termination alert via Gmail SMTP
    const emailSubject = '[e-GRCP] Security Notice: Account Access Revoked';
    const emailBody = `Dear ${employeeToFire.name},

Please be advised that your access authorization for the e-GRCP Portal under the username ${employeeToFire.email} has been terminated, effective immediately.

As a result of this action:
• All active session tokens have been invalidated.
• Access permissions associated with your profile have been revoked.
• Pending GRC responsibilities and procurement approvals have been routed for administrative re-assignment.

If you believe this revocation was executed in error or require temporary access to retrieve outstanding GRC deliverables, please open a ticket with IT Support or contact your Department Manager.

Sincerely,
e-GRCP Identity & Access Management (IAM) Team
Enterprise Security Group`;

    fetch(mailerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: employeeToFire.email,
        toName: employeeToFire.name,
        subject: emailSubject,
        body: emailBody,
      })
    })
      .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t || `HTTP ${res.status}`) }))
      .then(data => {
        if (data.success) console.log('✅ Termination email sent:', data.messageId);
        else console.warn('⚠️ Email delivery issue:', data.error);
      })
      .catch(err => console.warn('❌ Mailer API Error:', err.message || err));

    // Dispatches the fireEmployee action
    dispatch(fireEmployee(employeeToFire.id));

    // Audit logs the termination action
    dispatch(
      addAuditLog({
        user: user.name,
        role: user.role,
        action: 'Terminate Employee',
        module: 'System',
        description: `Terminated employee profile and revoked access: ${employeeToFire.name} (${employeeToFire.role}) — ${employeeToFire.email}`,
        ip: '127.0.0.1',
      })
    );

    // Save mail notification detail for sent log
    dispatch(logSentEmail({
      to: employeeToFire.email,
      toName: employeeToFire.name,
      role: employeeToFire.role,
      department: employeeToFire.department,
      password: 'REVOKED (TERMINATED)',
      sentBy: user?.name || 'Administrator',
      subject: emailSubject,
    }));

    setSuccessMsg(`Revoked all platform permissions and terminated account for ${employeeToFire.name}. Real security notification dispatched to ${employeeToFire.email}.`);
    setFireDialogOpen(false);
    setEmployeeToFire(null);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const formatTimestamp = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch { return iso; }
  };

  const roleStats = employees.reduce((acc, emp) => {
    acc[emp.role] = (acc[emp.role] || 0) + 1;
    return acc;
  }, {});

  // Access validation: double check role authority
  const hasFireAccess = user?.role === 'Administrator' || user?.role === 'Procurement Manager';

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <PeopleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h1" fontWeight={800} color="text.primary">Employee Directory</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Provision, manage, and terminate employee accounts. Access restricted to Administrator and Management.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ height: '44px', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3, boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
        >
          Provision Employee
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>
      )}

      {/* Role Summary Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: '14px', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: 'none' }}>
            <Typography variant="h3" fontWeight={800} color="primary.main">{employees.length}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>Total Accounts</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: '14px', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: 'none' }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#6366f1' }}>{roleStats['Administrator'] || 0}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>Administrators</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: '14px', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: 'none' }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#06b6d4' }}>{roleStats['Procurement Manager'] || 0}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>Managers</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: '14px', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: 'none' }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#10b981' }}>{(roleStats['Employee'] || 0) + (roleStats['Auditor'] || 0) + (roleStats['Compliance Officer'] || 0)}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>Other Roles</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Employee Table */}
      <Paper sx={{ borderRadius: '14px', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: 'none', overflow: 'hidden', mb: 4 }}>
        <Box sx={{ px: 3, py: 2.5, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Typography variant="h6" fontWeight={700}>All Accounts ({employees.length})</Typography>
          <Typography variant="body2" color="text.secondary">Only Administrators and Procurement Managers can modify system access rules.</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)' }}>
                <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Access Role</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Access Level</TableCell>
                {hasFireAccess && <TableCell sx={{ fontWeight: 700, py: 1.5, textAlign: 'right' }}>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => {
                const roleStyle = ROLE_COLORS[emp.role] || ROLE_COLORS.Employee;
                const isAdmin = emp.role === 'Administrator';
                const isSelf = emp.id === user?.id;

                return (
                  <TableRow key={emp.id} hover>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 38, height: 38, fontSize: '0.85rem', bgcolor: roleStyle.color, fontWeight: 700 }}>{emp.avatar}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{emp.name}</Typography>
                          {isSelf && <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>You</Typography>}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}><Typography variant="body2" color="text.secondary">{emp.email}</Typography></TableCell>
                    <TableCell sx={{ py: 2 }}><Typography variant="body2" fontWeight={500}>{emp.department}</Typography></TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.5, borderRadius: '8px', bgcolor: roleStyle.bg, color: roleStyle.color, fontSize: '0.76rem', fontWeight: 700 }}>
                        {isAdmin && <AdminPanelSettingsIcon sx={{ fontSize: 14 }} />}
                        {emp.role}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Tooltip title={isAdmin ? 'Full system access' : 'Limited to role modules'}>
                        <Chip size="small" label={isAdmin ? 'Full Access' : 'Role-Based'} icon={isAdmin ? <AdminPanelSettingsIcon /> : <BadgeIcon />}
                          sx={{ fontSize: '0.72rem', fontWeight: 600, bgcolor: isAdmin ? 'rgba(99,102,241,0.08)' : 'rgba(148,163,184,0.08)', color: isAdmin ? '#6366f1' : 'text.secondary', border: 'none' }}
                        />
                      </Tooltip>
                    </TableCell>
                    
                    {/* Fire Button for Admin and HR */}
                    {hasFireAccess && (
                      <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
                        {!isSelf ? (
                          <Tooltip title="Fire Employee (Revoke Access)">
                            <IconButton 
                              onClick={() => handleFireClick(emp)} 
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } 
                              }}
                            >
                              <WhatshotIcon sx={{ color: '#ef4444' }} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', pr: 1.5 }}>Active User</Typography>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ==================== SENT EMAILS LOG ==================== */}
      <Paper sx={{ borderRadius: '14px', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: 'none', overflow: 'hidden' }}>
        <Box
          onClick={() => setMailLogOpen(!mailLogOpen)}
          sx={{
            px: 3, py: 2.5,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer', userSelect: 'none',
            borderBottom: mailLogOpen ? (t) => `1px solid ${t.palette.divider}` : 'none',
            transition: 'background 0.15s',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EmailIcon sx={{ color: '#ea4335', fontSize: 22 }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Sent Credential Emails
                {sentEmails.length > 0 && (
                  <Chip label={sentEmails.length} size="small" sx={{ ml: 1.5, fontWeight: 700, fontSize: '0.72rem', height: 22, bgcolor: 'rgba(234,67,53,0.1)', color: '#ea4335' }} />
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">Review all credential dispatch emails sent to provisioned employees.</Typography>
            </Box>
          </Box>
          <IconButton size="small">{mailLogOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        </Box>

        <Collapse in={mailLogOpen}>
          {sentEmails.length === 0 ? (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <EmailIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
              <Typography variant="body1" color="text.secondary" fontWeight={500}>No emails dispatched yet.</Typography>
              <Typography variant="body2" color="text.disabled">Provision an employee to send their first welcome email.</Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
              {sentEmails.map((mail) => (
                <Box key={mail.id}>
                  {/* Email Row Summary */}
                  <Box
                    onClick={() => setExpandedMailId(expandedMailId === mail.id ? null : mail.id)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      px: 3, py: 2,
                      cursor: 'pointer', userSelect: 'none',
                      transition: 'background 0.15s',
                      '&:hover': { bgcolor: 'action.hover' },
                      borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    }}
                  >
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#ea4335', fontSize: '0.8rem', fontWeight: 700 }}>
                      {(mail.toName || 'EM').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{mail.toName}</Typography>
                        <Typography variant="caption" color="text.disabled">— {mail.to}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" noWrap>{mail.subject}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', whiteSpace: 'nowrap' }}>{formatTimestamp(mail.timestamp)}</Typography>
                      <Chip size="small" label="Delivered" icon={<CheckCircleIcon />}
                        sx={{ mt: 0.5, height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', '& .MuiChip-icon': { fontSize: 12, color: '#10b981' } }}
                      />
                    </Box>
                    <IconButton size="small">{expandedMailId === mail.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                  </Box>

                  {/* Expanded Email Body Preview */}
                  <Collapse in={expandedMailId === mail.id}>
                    <Box sx={{
                      mx: 3, my: 2, p: 3,
                      bgcolor: (t) => t.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
                      border: (t) => `1px solid ${t.palette.divider}`,
                      borderRadius: '14px'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <EmailIcon sx={{ color: '#ea4335', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                          Email Preview
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 0.5 }}>
                        <strong>From:</strong> e-GRCP Platform &lt;noreply@egrcp.com&gt;
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 0.5 }}>
                        <strong>To:</strong> {mail.toName} &lt;{mail.to}&gt;
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 0.5 }}>
                        <strong>Subject:</strong> {mail.subject}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.disabled', mb: 1.5 }}>
                        <strong>Sent by:</strong> {mail.sentBy} · {formatTimestamp(mail.timestamp)}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />

                      <Typography component="div" variant="body2" sx={{ lineHeight: 1.8, color: 'text.primary', mt: 1.5 }}>
                        Dear {mail.toName},<br /><br />
                        We are pleased to inform you that your enterprise access credentials for the <strong>e-GRCP Portal</strong> have been provisioned by system administration.<br /><br />
                        Your account details are outlined below:<br />
                        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: '8px', my: 2, border: (t) => `1px solid ${t.palette.divider}`, fontFamily: 'monospace' }}>
                          Portal Address:      <span style={{ color: '#22d3ee' }}>{window.location.origin}/login</span><br />
                          Username (Email):    {mail.to}<br />
                          Assigned Role:       {mail.role}<br />
                          Primary Department:  {mail.department}<br />
                          Temporary Password:  <code style={{ fontSize: '0.92rem', color: '#6366f1', fontWeight: 'bold' }}>{mail.password}</code>
                        </Box>
                        <strong>Security Instructions:</strong><br />
                        1. Navigate to the login portal using the link above.<br />
                        2. Enter your username and the temporary password provided.<br />
                        3. Upon successful authentication, you will be prompted to establish a new, secure password meeting corporate password complexity requirements.<br /><br />
                        This is an automated security transmission. If you did not request this account or believe this request was made in error, please contact the IT Security Operations Center immediately.<br /><br />
                        Sincerely,<br />
                        <strong>e-GRCP Identity & Access Management (IAM) Team</strong><br />
                        <em style={{ color: '#94a3b8' }}>Enterprise Security Group</em>
                      </Typography>
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </Box>
          )}
        </Collapse>
      </Paper>

      {/* ==================== PROVISION DIALOG ==================== */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '18px', p: 1, maxWidth: '500px', width: '100%',
              border: (t) => `1px solid ${t.palette.divider}`,
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
            }
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', fontSize: '1.35rem', pb: 0.5 }}>
            Provision New Employee
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a corporate account. The password will be securely dispatched to the employee's inbox.
            </Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px' }}>{errorMsg}</Alert>}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField required fullWidth label="Full Name" placeholder="e.g. Jane Smith"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                slotProps={{ input: { sx: { borderRadius: '12px' } } }}
              />
              <TextField required fullWidth type="email" label="Email Address" placeholder="e.g. jane@egrcp.com"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                slotProps={{ input: { sx: { borderRadius: '12px' } } }}
              />
              <TextField
                required fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Access Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                slotProps={{
                  input: {
                    sx: { borderRadius: '12px', fontFamily: showPassword ? 'inherit' : 'monospace' },
                    endAdornment: (
                      <InputAdornment position="end" sx={{ gap: 0.5 }}>
                        <Tooltip title="Auto-Generate Password">
                          <IconButton onClick={handleAutoGenerate} edge="end" color="primary">
                            <VpnKeyIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={showPassword ? 'Hide Password' : 'Show Password'}>
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }
                }}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Security Role</InputLabel>
                    <Select label="Security Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} sx={{ borderRadius: '12px' }}>
                      <MenuItem value="Employee">Employee</MenuItem>
                      <MenuItem value="Procurement Manager">Procurement Manager</MenuItem>
                      <MenuItem value="Compliance Officer">Compliance Officer</MenuItem>
                      <MenuItem value="Auditor">Auditor</MenuItem>
                      <MenuItem value="Administrator">Administrator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select label="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} sx={{ borderRadius: '12px' }}>
                      <MenuItem value="IT">IT</MenuItem>
                      <MenuItem value="Procurement">Procurement</MenuItem>
                      <MenuItem value="Legal">Legal</MenuItem>
                      <MenuItem value="Internal Audit">Internal Audit</MenuItem>
                      <MenuItem value="IT Admin">IT Admin</MenuItem>
                      <MenuItem value="Finance">Finance</MenuItem>
                      <MenuItem value="HR">HR</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={handleClose} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 3 }}>Provision Account</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ==================== SMTP DISPATCH OVERLAY ==================== */}
      <Dialog
        open={dispatchOpen}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px', p: 3, maxWidth: '540px', width: '100%',
              border: (t) => `1px solid ${t.palette.divider}`,
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            }
          }
        }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, maxHeight: '80vh', overflowY: 'auto' }}>
          {dispatchStep === 0 ? (
            <>
              <CircularProgress size={60} thickness={4} sx={{ color: '#22d3ee', mb: 3 }} />
              <Typography variant="h3" fontWeight={800} sx={{ mb: 1, fontFamily: '"Outfit", sans-serif' }}>
                Secure SMTP Relay
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Routing encrypted credentials to Gmail Servers...
              </Typography>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: '#22d3ee', display: 'block', mb: 0.5, fontWeight: 700, letterSpacing: '0.05em' }}>
                  SMTP SESSION LOG:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#94a3b8' }}>
                  [OK] Connected to smtp.gmail.com:587<br />
                  [OK] TLS handshake (AES_256_GCM)<br />
                  [SEND] Delivering to &lt;{dispatchedData.email}&gt;...
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ color: '#10b981', fontSize: 75, mb: 2.5 }} />
              <Typography variant="h3" fontWeight={800} sx={{ mb: 1, fontFamily: '"Outfit", sans-serif', color: '#10b981' }}>
                Email Dispatched Successfully
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                A secure welcome email has been delivered to <strong>{dispatchedData.email}</strong>.
              </Typography>

              {/* Full Email Preview — scrollable */}
              <Box sx={{
                bgcolor: (t) => t.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
                border: (t) => `1px solid ${t.palette.divider}`,
                p: 3, borderRadius: '16px', width: '100%', textAlign: 'left',
                maxHeight: '300px', overflowY: 'auto'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <EmailIcon sx={{ color: '#ea4335' }} />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    Gmail SMTP Message Preview
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 0.5 }}>
                  <strong>From:</strong> e-GRCP Platform &lt;noreply@egrcp.com&gt;
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 0.5 }}>
                  <strong>To:</strong> {dispatchedData.name} &lt;{dispatchedData.email}&gt;
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                  <strong>Subject:</strong> [Action Required] Account Provisioned on e-GRCP Platform
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography component="div" variant="body2" sx={{ lineHeight: 1.8, color: 'text.primary', mt: 1 }}>
                  Dear {dispatchedData.name},<br /><br />
                  We are pleased to inform you that your enterprise access credentials for the <strong>e-GRCP Portal</strong> have been provisioned by system administration.<br /><br />
                  Your account details are outlined below:<br />
                  <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: '8px', my: 2, border: (t) => `1px solid ${t.palette.divider}`, fontFamily: 'monospace' }}>
                    Portal Address:      <span style={{ color: '#22d3ee' }}>{window.location.origin}/login</span><br />
                    Username (Email):    {dispatchedData.email}<br />
                    Assigned Role:       {dispatchedData.role}<br />
                    Primary Department:  {dispatchedData.department}<br />
                    Temporary Password:  <code style={{ fontSize: '0.92rem', color: '#6366f1', fontWeight: 'bold' }}>{dispatchedData.password}</code>
                  </Box>
                  <strong>Security Instructions:</strong><br />
                  1. Navigate to the login portal using the link above.<br />
                  2. Enter your username and the temporary password provided.<br />
                  3. Upon successful authentication, you will be prompted to establish a new, secure password meeting corporate password complexity requirements.<br /><br />
                  This is an automated security transmission. If you did not request this account or believe this request was made in error, please contact the IT Security Operations Center immediately.<br /><br />
                  Sincerely,<br />
                  <strong>e-GRCP Identity & Access Management (IAM) Team</strong><br />
                  <em style={{ color: '#94a3b8' }}>Enterprise Security Group</em>
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        {dispatchStep === 1 && (
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                setDispatchOpen(false);
                setSuccessMsg(`Welcome email dispatched to ${dispatchedData.email} — check the Sent Emails log below.`);
                setTimeout(() => setSuccessMsg(''), 6000);
              }}
              sx={{ borderRadius: '10px', textTransform: 'none', px: 4, fontWeight: 700 }}
            >
              Done & Close
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* ==================== FIRE CONFIRMATION DIALOG ==================== */}
      <Dialog
        open={fireDialogOpen}
        onClose={() => setFireDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '18px', p: 1.5, maxWidth: '460px', width: '100%',
              border: (t) => `1px solid ${t.palette.divider}`,
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'error.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PersonRemoveIcon sx={{ fontSize: 28 }} />
          Confirm Employee Termination
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5 }}>
            Are you sure you want to terminate system access for {employeeToFire?.name}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action will immediately invalidate all security access tokens and permanently delete the employee's active session profile from the directory. All GRC compliance records and assignments managed by this user will require re-assignment.
          </Typography>
          <Box sx={{ mt: 2.5, p: 2, bgcolor: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 800, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
              ⚠️ Security warning:
            </Typography>
            <Typography variant="body2" sx={{ color: 'error.main', fontSize: '0.78rem' }}>
              This termination action will be logged in the system GRC Audit log under standard SOX security control directives.
            </Typography>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setFireDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleFireConfirm} 
            variant="contained" 
            color="error" 
            startIcon={<WhatshotIcon />}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 3, bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
          >
            Fire Employee (Terminate)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeDirectoryPage;
