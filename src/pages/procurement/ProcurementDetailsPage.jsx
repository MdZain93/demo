/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Redux
import {
  fetchRequestById,
  submitComment,
  processApproval,
  clearSelectedRequest
} from '../../features/procurement/procurementSlice';
import { addAuditLog } from '../../features/audit/auditSlice';
import { triggerSystemAlert } from '../../features/notifications/notificationSlice';

// Components
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import { supabase } from '../../lib/supabaseClient';

import AppCard from '../../components/common/AppCard';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import StatusChip from '../../components/common/StatusChip';
import RiskChip from '../../components/common/RiskChip';
import ApprovalCommentForm from '../../components/forms/ApprovalCommentForm';
import AppModal from '../../components/common/AppModal';
import formatCurrency from '../../utils/formatCurrency';
import { formatDate, formatDateOnly } from '../../utils/formatDate';

const getFileName = (urlOrName) => {
  if (!urlOrName) return '';
  if (urlOrName.startsWith('http://') || urlOrName.startsWith('https://') || urlOrName.startsWith('procurements/')) {
    try {
      const decoded = decodeURIComponent(urlOrName);
      const parts = decoded.split('/');
      const lastPart = parts[parts.length - 1];
      return lastPart.includes('_') ? lastPart.split('_').slice(1).join('_') : lastPart;
    } catch {
      return urlOrName;
    }
  }
  return urlOrName;
};


export function ProcurementDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state selectors
  const { selectedRequest, loading, error } = useSelector((state) => state.procurement);
  const { user } = useSelector((state) => state.auth);

  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(''); // Approve, Reject, Send Back
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchRequestById(id));
    return () => {
      dispatch(clearSelectedRequest());
    };
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await dispatch(submitComment({ id, commentText, user })).unwrap();
      
      // Log audit
      dispatch(addAuditLog({
        user: user.name,
        role: user.role,
        action: 'Add Comment',
        module: 'Procurement',
        description: `Added comment to request ${id}`,
        ip: '192.168.1.12'
      }));

      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const openApprovalModal = (action) => {
    setPendingAction(action);
    setApprovalModalOpen(true);
  };

  const handleApprovalAction = async (formData) => {
    let finalStatus = 'Approved';
    if (pendingAction === 'Reject') finalStatus = 'Rejected';
    else if (pendingAction === 'Send Back') finalStatus = 'Send Back';

    try {
      await dispatch(processApproval({
        id,
        status: finalStatus,
        user,
        comment: formData.comment
      })).unwrap();

      // Trigger Audit Log
      dispatch(addAuditLog({
        user: user.name,
        role: user.role,
        action: `${pendingAction} Procurement`,
        module: 'Procurement',
        description: `${pendingAction}ed procurement request ${id} with comments: "${formData.comment.substring(0, 50)}"`,
        ip: '192.168.1.12'
      }));

      // Trigger System Alert for the employee
      dispatch(triggerSystemAlert({
        title: `PR ${id} status updated`,
        message: `Your request "${selectedRequest.title}" was ${finalStatus.toLowerCase()} by ${user.name}.`,
        type: 'Procurement',
        priority: finalStatus === 'Rejected' ? 'High' : 'Medium'
      }));

      setSnackbarMessage(`Request ${id} successfully ${finalStatus.toLowerCase()}.`);
      setSnackbarOpen(true);
      setApprovalModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (fileUrl) => {
    if (fileUrl.startsWith('procurements/')) {
      try {
        setSnackbarMessage(`Generating secure temporary link...`);
        setSnackbarOpen(true);
        const { data, error } = await supabase.storage
          .from('E-GREP')
          .createSignedUrl(fileUrl, 3600); // 1 hour link
          
        if (error) throw error;
        
        window.open(data.signedUrl, '_blank');
      } catch (err) {
        console.error('Error generating signed URL:', err);
        alert(`Failed to retrieve file from storage: ${err.message || err}\n\nPlease check that your 'E-GREP' bucket policies are set to allow SELECT (Read) access!`);
      }
    } else if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      window.open(fileUrl, '_blank');
      setSnackbarMessage(`Opening attachment from storage...`);
      setSnackbarOpen(true);
    } else {
      const blob = new Blob([`Attachment Content for: ${fileUrl}\nSource: GRC Procurement Module`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage(`Attachment ${fileUrl} downloaded successfully.`);
      setSnackbarOpen(true);
    }
  };


  if (loading || !selectedRequest) {
    return <AppLoader message="Acquiring transaction metadata & logs..." />;
  }

  if (error) {
    return <AppError message={error} retryAction={() => dispatch(fetchRequestById(id))} />;
  }

  // Permission Checks: Managers can approve requests pending approval
  const isPendingApproval = selectedRequest.status === 'Submitted' || selectedRequest.status === 'Pending Approval';
  const canApprove = (user?.role === 'Procurement Manager' || user?.role === 'Administrator') && isPendingApproval;

  return (
    <Box>
      {/* Navigation Breadcrumbs */}
      <AppBreadcrumbs links={[{ label: 'Procurement', to: '/procurement' }]} activeLabel={id} />

      {/* Detail title row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to="/procurement" color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h1" fontWeight={800} sx={{ letterSpacing: '-0.03em', mb: 0.5, fontFamily: '"Outfit", sans-serif' }}>
              {selectedRequest.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.7, fontWeight: 500 }}>
              ID: <Typography component="span" fontWeight={700} color="text.primary">{selectedRequest.id}</Typography> &bull; Requested by <Typography component="span" fontWeight={700} color="text.primary">{selectedRequest.requestedBy}</Typography> ({selectedRequest.department} Department)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <StatusChip status={selectedRequest.status} />
          <RiskChip level={selectedRequest.riskLevel} />
        </Box>
      </Box>

      {/* Layout Grid */}
      <Grid container spacing={3}>
        
        {/* Left Side Tabs Area */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper 
            sx={{ 
              borderRadius: '14px', 
              overflow: 'hidden', 
              mb: 3,
              boxShadow: 'none',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                px: 3,
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': {
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  minHeight: '56px',
                  py: 2,
                  opacity: 0.7,
                  '&.Mui-selected': { opacity: 1 }
                }
              }}
            >
              <Tab label="Overview" />
              <Tab label={`Attachments (${selectedRequest.attachments?.length || 0})`} />
              <Tab label="Approval History" />
              <Tab label={`Comments (${selectedRequest.comments?.length || 0})`} />
              <Tab label="System Audit Logs" />
            </Tabs>

            {/* Tab content 1: Overview */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif', 
                    fontWeight: 700, 
                    letterSpacing: '-0.01em',
                    mb: 2.5
                  }}
                >
                  Business Justification Description
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, mb: 4, fontSize: '0.95rem' }}>
                  {selectedRequest.description || 'No business description provided.'}
                </Typography>
                
                <Divider sx={{ my: 4, opacity: 0.5 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Vendor</Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ mt: 1, fontSize: '1rem' }}>{selectedRequest.vendor}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Allocation Category</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ mt: 1, fontSize: '1rem' }}>{selectedRequest.category}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Submitted Date</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ mt: 1, fontSize: '1rem' }}>{formatDateOnly(selectedRequest.createdDate)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fulfillment Deadline Date</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ mt: 1, fontSize: '1rem' }}>{formatDateOnly(selectedRequest.requiredDate)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab content 2: Attachments */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif', 
                    fontWeight: 700, 
                    letterSpacing: '-0.01em',
                    mb: 3
                  }}
                >
                  Supporting Documentation
                </Typography>
                {selectedRequest.attachments?.length > 0 ? (
                  <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedRequest.attachments.map((file, idx) => (
                        <ListItem
                          key={idx}
                          sx={{
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                            borderRadius: '12px',
                            p: 2,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                            transition: 'all 0.2s',
                            '&:hover': { 
                              borderColor: 'primary.main',
                              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(37,99,235,0.05)' : 'rgba(37,99,235,0.02)'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 48, color: 'primary.main' }}>
                            <FilePresentIcon fontSize="medium" />
                          </ListItemIcon>
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography variant="body1" component="div" sx={{ fontWeight: 700 }}>
                                {getFileName(file)}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" component="div" color="text.secondary" sx={{ opacity: 0.7 }}>
                                PDF Document &bull; 2.4 MB
                              </Typography>
                            }
                          />
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownload(file)}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                          >
                            Download
                          </Button>
                        </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary">No attachments uploaded for this request.</Typography>
                )}
              </Box>
            )}

            {/* Tab content 3: Approval History */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif', 
                    fontWeight: 700, 
                    letterSpacing: '-0.01em',
                    mb: 3
                  }}
                >
                  Governance Approvals Path
                </Typography>
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedRequest.approvalHistory?.length > 0 ? (
                    selectedRequest.approvalHistory.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <ListItem sx={{ py: 3, alignItems: 'flex-start', px: 0 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main', 
                              width: 42, 
                              height: 42, 
                              mr: 2, 
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
                            }}
                          >
                            {step.user ? step.user.substring(0, 2).toUpperCase() : 'AU'}
                          </Avatar>
                            <ListItemText
                            disableTypography
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body1" component="div" fontWeight={700} sx={{ fontSize: '1rem' }}>
                                  {step.user} <Typography component="span" variant="caption" color="text.disabled" fontWeight={600}>({step.role})</Typography>
                                </Typography>
                                <Typography variant="caption" color="text.disabled" fontWeight={700}>
                                  {formatDate(step.timestamp)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                  <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action Outcome:</Typography>
                                  <Box 
                                    sx={{ 
                                      px: 1.5, 
                                      py: 0.3, 
                                      borderRadius: '4px', 
                                      fontSize: '0.65rem', 
                                      fontWeight: 800,
                                      bgcolor: step.action === 'Approved' ? 'success.dark' : step.action === 'Submitted' ? 'primary.dark' : 'error.dark',
                                      color: '#ffffff',
                                      textTransform: 'uppercase'
                                    }}
                                  >
                                    {step.action}
                                  </Box>
                                </Box>
                                {step.comment && (
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ 
                                      p: 2, 
                                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                      borderRadius: '12px',
                                      borderLeft: (theme) => `4px solid ${theme.palette.divider}`,
                                      fontStyle: 'italic',
                                      lineHeight: 1.6
                                    }}
                                  >
                                    &ldquo;{step.comment}&rdquo;
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {idx < selectedRequest.approvalHistory.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary">No approval milestones log available.</Typography>
                  )}
                </List>
              </Box>
            )}

            {/* Tab content 4: Comments */}
            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif', 
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    mb: 4
                  }}
                >
                  Discussion Feed
                </Typography>
                
                {/* Comments List */}
                <Box sx={{ mb: 5, maxHeight: '450px', overflowY: 'auto', pr: 2 }}>
                  {selectedRequest.comments?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                      {selectedRequest.comments.map((c, idx) => {
                        const isUser = c.author === user.name;
                        return (
                          <Box
                            key={c.id || idx}
                            sx={{
                              display: 'flex',
                              gap: 2,
                              alignItems: 'flex-start',
                              flexDirection: isUser ? 'row-reverse' : 'row'
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: isUser ? 'primary.main' : 'rgba(148, 163, 184, 0.1)',
                                color: isUser ? '#ffffff' : 'text.primary',
                                border: (theme) => `1px solid ${theme.palette.divider}`,
                                fontWeight: 700, 
                                fontSize: '0.8rem',
                                boxShadow: isUser ? '0 4px 10px rgba(37, 99, 235, 0.2)' : 'none'
                              }}
                            >
                              {c.author ? c.author.substring(0, 2).toUpperCase() : 'CO'}
                            </Avatar>
                            <Box 
                              sx={{ 
                                maxWidth: '75%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isUser ? 'flex-end' : 'flex-start'
                              }}
                            >
                              <Box sx={{ display: 'flex', gap: 1.5, mb: 0.8, px: 1 }}>
                                <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ letterSpacing: '0.02em' }}>
                                  {c.author} {isUser && '(You)'}
                                </Typography>
                                <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500 }}>
                                  {formatDate(c.timestamp)}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  p: 2.5,
                                  borderRadius: isUser ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                                  bgcolor: (theme) => isUser 
                                    ? 'primary.main' 
                                    : theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#f1f5f9',
                                  color: isUser ? '#ffffff' : 'text.primary',
                                  border: (theme) => isUser ? 'none' : `1px solid ${theme.palette.divider}`,
                                  boxShadow: isUser ? '0 8px 24px -8px rgba(37, 99, 235, 0.4)' : 'none',
                                  position: 'relative'
                                }}
                              >
                                <Typography variant="body2" sx={{ lineHeight: 1.7, fontWeight: isUser ? 500 : 400, fontSize: '0.9rem' }}>
                                  {c.text}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.4 }}>
                      <CommentIcon sx={{ fontSize: 64, mb: 2, color: 'text.disabled', opacity: 0.2 }} />
                      <Typography variant="body1" color="text.secondary" fontWeight={600}>No discussion comments listed yet.</Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 4, opacity: 0.5 }} />

                {/* Add Comment input */}
                <Box 
                  component="form" 
                  onSubmit={handleCommentSubmit} 
                  sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    alignItems: 'flex-start',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.3)' : '#f8fafc',
                    p: 2,
                    borderRadius: '16px',
                    border: (theme) => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type your message to the procurement team..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: 'transparent',
                        '& fieldset': { border: 'none' }
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={!commentText.trim()}
                    sx={{ 
                      height: '48px', 
                      minWidth: '48px', 
                      width: '48px',
                      p: 0,
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    <SendIcon sx={{ fontSize: 20 }} />
                  </Button>
                </Box>
              </Box>
            )}

            {/* Tab content 5: Audit logs */}
            {activeTab === 4 && (
              <Box sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif', 
                    fontWeight: 700, 
                    letterSpacing: '-0.01em',
                    mb: 3
                  }}
                >
                  Technical System Audit Trail
                </Typography>
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedRequest.auditLogs?.length > 0 ? (
                    selectedRequest.auditLogs.map((log, idx) => (
                      <React.Fragment key={idx}>
                        <ListItem 
                          sx={{ 
                            py: 2, 
                            borderRadius: '8px',
                            px: 1,
                            '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc' }
                          }}
                        >
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography variant="body1" component="div" sx={{ fontWeight: 700 }}>
                                {log.action}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" component="div" color="text.secondary" sx={{ mt: 0.5, opacity: 0.7 }}>
                                {`Modified by: ${log.user}`}
                              </Typography>
                            }
                          />
                          <Typography variant="caption" color="text.disabled" fontWeight={700}>
                            {formatDate(log.timestamp)}
                          </Typography>
                        </ListItem>
                        {idx < selectedRequest.auditLogs.length - 1 && <Divider sx={{ opacity: 0.3 }} />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary">No system edits logged.</Typography>
                  )}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Side Overview Pricing Card & Approval controls */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Expenditure Summary Panel */}
          <AppCard title="Expenditure Summary" subheader="Valuation Details" sx={{ mb: 3 }}>
            <Box 
              sx={{ 
                py: 4, 
                textAlign: 'center', 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(37, 99, 235, 0.05)', 
                borderRadius: '14px', 
                mb: 4,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  bgcolor: 'primary.main'
                }
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: '0.15em', mb: 1, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block' }}>
                TOTAL VALUATION
              </Typography>
              <Typography 
                variant="h2" 
                fontWeight={800} 
                color="primary.main"
                sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.02em', fontSize: '2.5rem' }}
              >
                {formatCurrency(selectedRequest.amount)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, px: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.65rem' }}>Target Vendor</Typography>
                <Typography variant="body1" fontWeight={700} sx={{ mt: 1, fontSize: '1.05rem' }}>{selectedRequest.vendor}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.65rem' }}>Priority Severity</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: selectedRequest.priority === 'High' ? 'error.main' : selectedRequest.priority === 'Medium' ? 'warning.main' : 'success.main',
                      boxShadow: (theme) => `0 0 12px ${selectedRequest.priority === 'High' ? theme.palette.error.main : selectedRequest.priority === 'Medium' ? theme.palette.warning.main : theme.palette.success.main}`
                    }} 
                  />
                  <Typography variant="body1" fontWeight={700} sx={{ fontSize: '1.05rem' }}>{selectedRequest.priority}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.65rem' }}>Required Delivery</Typography>
                <Typography variant="body1" fontWeight={700} sx={{ mt: 1, fontSize: '1.05rem' }}>{formatDateOnly(selectedRequest.requiredDate)}</Typography>
              </Box>
            </Box>
          </AppCard>

          {/* Supervisor Approval Workbench controls */}
          {canApprove && (
            <AppCard title="Approval Workbench" subheader="Decision Center" sx={{ borderColor: 'primary.main', borderStyle: 'solid', borderWidth: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500, lineHeight: 1.6 }}>
                You have pending review requests for this procurement. Select a final governance action:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => openApprovalModal('Approve')}
                  sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  Approve Request
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  onClick={() => openApprovalModal('Send Back')}
                  sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  Send Back for Info
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => openApprovalModal('Reject')}
                  sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  Reject Request
                </Button>
              </Box>
            </AppCard>
          )}
        </Grid>

      </Grid>

      {/* Action Dialog Modal */}
      <AppModal
        open={approvalModalOpen}
        title={`${pendingAction} GRC Procurement Request`}
        onClose={() => setApprovalModalOpen(false)}
      >
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You are preparing to <strong>{pendingAction?.toLowerCase()}</strong> request <strong>{selectedRequest.id}</strong>. Please provide justifications/reasons below for the historical log:
        </Typography>
        <ApprovalCommentForm
          confirmLabel={pendingAction}
          onSubmit={handleApprovalAction}
        />
      </AppModal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)} sx={{ borderRadius: '8px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProcurementDetailsPage;
