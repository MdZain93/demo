-- e-GRCP Platform — Supabase Database Schema & Seed Data
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  avatar TEXT DEFAULT ''
);

INSERT INTO users (id, email, password, name, role, department, avatar) VALUES
('u1','employee@egrcp.com','password123','John Doe','Employee','IT','JD'),
('u2','manager@egrcp.com','password123','Sarah Jenkins','Procurement Manager','Procurement','SJ'),
('u3','compliance@egrcp.com','password123','Marcus Vance','Compliance Officer','Legal','MV'),
('u4','auditor@egrcp.com','password123','Elena Rostova','Auditor','Internal Audit','ER'),
('u5','admin@egrcp.com','password123','Alex Mercer','Administrator','IT Admin','AM')
ON CONFLICT (id) DO NOTHING;

-- 2. VENDORS
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  country TEXT,
  risk_level TEXT DEFAULT 'Low',
  compliance_status TEXT DEFAULT 'Under Review',
  status TEXT DEFAULT 'Pending',
  last_review_date TEXT,
  contact JSONB DEFAULT '{}',
  documents JSONB DEFAULT '[]',
  history JSONB DEFAULT '[]'
);

INSERT INTO vendors (id, name, category, country, risk_level, compliance_status, status, last_review_date, contact, documents, history) VALUES
('V-1001','Global Tech Solutions Inc.','IT Software','United States','Low','Compliant','Active','2026-05-15','{"name":"Alice Cooper","email":"alice@globaltech.com","phone":"+1 (555) 019-2834"}','[{"name":"ISO 27001 Certificate","expiryDate":"2027-12-31","status":"Valid"},{"name":"Tax Registration Certificate","expiryDate":"2026-12-31","status":"Valid"},{"name":"Liability Insurance Document","expiryDate":"2027-06-30","status":"Valid"},{"name":"Compliance Declaration","expiryDate":"2028-01-15","status":"Valid"}]','[{"id":"PR-5001","amount":125000,"date":"2026-03-10","status":"Completed"},{"id":"PR-5008","amount":45000,"date":"2026-05-02","status":"Completed"}]'),
('V-1002','Apex Logistics Group','Operations','Germany','Medium','Compliant','Active','2026-04-22','{"name":"Dieter Schwarz","email":"d.schwarz@apex-logistics.de","phone":"+49 89 2019382"}','[{"name":"ISO 9001 Certificate","expiryDate":"2026-03-01","status":"Expired"},{"name":"Tax Registration Certificate","expiryDate":"2026-12-31","status":"Valid"},{"name":"Liability Insurance Document","expiryDate":"2027-03-15","status":"Valid"},{"name":"Compliance Declaration","expiryDate":"2026-02-10","status":"Expired"}]','[{"id":"PR-5002","amount":89000,"date":"2026-04-01","status":"Completed"}]'),
('V-1003','Sinergy HR Consulting','Human Resources','United Kingdom','Low','Compliant','Active','2026-06-01','{"name":"Clara Oswald","email":"clara@sinergyhr.co.uk","phone":"+44 20 7946 0192"}','[{"name":"Data Privacy Pledge","expiryDate":"2027-08-15","status":"Valid"},{"name":"Tax Registration Certificate","expiryDate":"2026-12-31","status":"Valid"},{"name":"Compliance Declaration","expiryDate":"2027-01-01","status":"Valid"}]','[]'),
('V-1004','Nova Cloud Infrastructure','IT Cloud Services','Singapore','High','Non-Compliant','In Review','2026-06-20','{"name":"Kenji Sato","email":"k.sato@novacloud.sg","phone":"+65 6789 0123"}','[{"name":"SOC 2 Type II Report","expiryDate":"2026-01-15","status":"Expired"},{"name":"ISO 27001 Certificate","expiryDate":"2026-05-30","status":"Expired"},{"name":"Tax Registration Certificate","expiryDate":"2026-12-31","status":"Valid"},{"name":"Liability Insurance Document","expiryDate":"missing","status":"Missing"}]','[{"id":"PR-5003","amount":340000,"date":"2026-02-15","status":"Completed"}]'),
('V-1005','Apex Builders Ltd','Facilities','Canada','Critical','Non-Compliant','Suspended','2026-03-05','{"name":"Robert Miller","email":"r.miller@apexbuilders.ca","phone":"+1 (416) 555-0144"}','[{"name":"H&S Certificate","expiryDate":"2025-11-30","status":"Expired"},{"name":"Tax Registration Certificate","expiryDate":"2026-12-31","status":"Valid"},{"name":"Liability Insurance Document","expiryDate":"missing","status":"Missing"}]','[{"id":"PR-5004","amount":1200000,"date":"2025-10-05","status":"Completed"}]'),
('V-1006','Prime Office Supplies','Operations','United States','Low','Compliant','Active','2026-02-18','{"name":"Thomas Edison","email":"tedison@primesupplies.com","phone":"+1 (800) 555-0199"}','[{"name":"Tax Registration Certificate","expiryDate":"2027-12-31","status":"Valid"},{"name":"Compliance Declaration","expiryDate":"2028-02-18","status":"Valid"}]','[{"id":"PR-5005","amount":12000,"date":"2026-04-10","status":"Completed"}]')
ON CONFLICT (id) DO NOTHING;

-- 3. PROCUREMENT REQUESTS
CREATE TABLE IF NOT EXISTS procurement_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  requested_by TEXT,
  vendor TEXT,
  amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Draft',
  risk_level TEXT DEFAULT 'Low',
  created_date TEXT,
  required_date TEXT,
  priority TEXT DEFAULT 'Medium',
  category TEXT,
  description TEXT,
  attachments JSONB DEFAULT '[]',
  comments JSONB DEFAULT '[]',
  approval_history JSONB DEFAULT '[]',
  audit_logs JSONB DEFAULT '[]'
);

INSERT INTO procurement_requests (id, title, department, requested_by, vendor, amount, status, risk_level, created_date, required_date, priority, category, description, attachments, comments, approval_history, audit_logs) VALUES
('PR-5001','Enterprise Cloud Migration Software Licensing','IT','John Doe','Global Tech Solutions Inc.',125000,'Completed','Low','2026-03-01','2026-04-01','High','IT Software','Annual licensing subscription for cloud orchestration tool and migration agents to support our move to Google Cloud.','["Cloud_Migration_Spec.pdf","GlobalTech_Quote_Q1.pdf"]','[{"id":"c1","author":"John Doe","role":"Employee","text":"This is critical for our Q2 migration milestone.","timestamp":"2026-03-01T10:00:00Z"},{"id":"c2","author":"Sarah Jenkins","role":"Procurement Manager","text":"Pricing aligns with standard GSA schedules. Approved.","timestamp":"2026-03-05T14:30:00Z"}]','[{"step":"Submission","user":"John Doe","role":"Employee","action":"Submitted","timestamp":"2026-03-01T10:05:00Z","comment":"Initial submission"},{"step":"Management Review","user":"Sarah Jenkins","role":"Procurement Manager","action":"Approved","timestamp":"2026-03-05T14:30:00Z","comment":"Fully within budget bounds."}]','[{"timestamp":"2026-03-01T10:05:00Z","user":"John Doe","action":"Created request"},{"timestamp":"2026-03-05T14:30:00Z","user":"Sarah Jenkins","action":"Approved request and set status to Completed"}]'),
('PR-5002','Logistics Dispatch Route Optimization Platform','Operations','Alice Cooper','Apex Logistics Group',89000,'Completed','Medium','2026-03-15','2026-04-15','Medium','Operations','Integration and software purchase for AI-based dispatch routing to optimize delivery truck fuel usage.','["ApexLogistics_Quote.pdf"]','[]','[{"step":"Submission","user":"Alice Cooper","role":"Employee","action":"Submitted","timestamp":"2026-03-15T09:00:00Z","comment":"Submitted"},{"step":"Review","user":"Sarah Jenkins","role":"Procurement Manager","action":"Approved","timestamp":"2026-03-20T11:15:00Z","comment":"Approved following technical evaluation."}]','[]'),
('PR-5003','Next-Gen Data Lake Storage Setup','IT','John Doe','Nova Cloud Infrastructure',340000,'Pending Approval','High','2026-06-18','2026-07-31','Critical','IT Cloud Services','High throughput storage block provisioning for global analytics data lake. Vendor high risk is flagged due to an expired SOC 2 Type II report.','["NovaCloud_Proposal_Draft.pdf"]','[{"id":"c3","author":"Marcus Vance","role":"Compliance Officer","text":"Flagging this. Nova Cloud SOC 2 has expired. I need their updated compliance certification before final sign-off.","timestamp":"2026-06-20T16:45:00Z"}]','[{"step":"Submission","user":"John Doe","role":"Employee","action":"Submitted","timestamp":"2026-06-18T11:00:00Z","comment":"Urgently needed for global metrics platform."}]','[{"timestamp":"2026-06-18T11:00:00Z","user":"John Doe","action":"Created request and submitted for approval"}]'),
('PR-5004','Corporate Office Remodeling and Expansion','Facilities','Richard Wright','Apex Builders Ltd',1200000,'Rejected','Critical','2026-02-10','2026-09-01','Low','Facilities','Renovating third and fourth floors of HQ to fit newly onboarded departments. Vendor suspended due to critical health and safety violations.','["HQ_FloorPlan_v3.pdf"]','[{"id":"c4","author":"Sarah Jenkins","role":"Procurement Manager","text":"Rejected. Apex Builders license is suspended. We cannot proceed with them.","timestamp":"2026-02-15T09:30:00Z"}]','[{"step":"Submission","user":"Richard Wright","role":"Employee","action":"Submitted","timestamp":"2026-02-10T14:00:00Z","comment":"Required for headcount growth."},{"step":"Approval","user":"Sarah Jenkins","role":"Procurement Manager","action":"Rejected","timestamp":"2026-02-15T09:30:00Z","comment":"Vendor is suspended due to compliance breaches."}]','[]'),
('PR-5005','Recruitment & Talent Sourcing Campaign','Human Resources','Emily Blunt','Sinergy HR Consulting',45000,'Send Back','Low','2026-06-22','2026-08-01','Medium','Human Resources','Executive search and engineering recruitment campaign to fill 25 technical leadership positions globally.','["Sinergy_Talent_Proposal.pdf"]','[{"id":"c5","author":"Sarah Jenkins","role":"Procurement Manager","text":"Please provide a granular breakdown of the search fees before approval.","timestamp":"2026-06-24T15:20:00Z"}]','[{"step":"Submission","user":"Emily Blunt","role":"Employee","action":"Submitted","timestamp":"2026-06-22T10:00:00Z","comment":"Critical recruitment support"},{"step":"Review","user":"Sarah Jenkins","role":"Procurement Manager","action":"Sent Back","timestamp":"2026-06-24T15:20:00Z","comment":"Requires detailed cost breakdown."}]','[]'),
('PR-5006','Office Essentials bulk stationery purchase','Finance','David Gilmour','Prime Office Supplies',12000,'Approved','Low','2026-06-25','2026-07-10','Low','Operations','Bulk procurement of whiteboards, paper reams, writing instruments, and standard office supplies for all domestic branch offices.','["PO_Supplies_Quote.pdf"]','[]','[{"step":"Submission","user":"David Gilmour","role":"Employee","action":"Submitted","timestamp":"2026-06-25T08:15:00Z","comment":"Regular office stocking."},{"step":"Review","user":"Sarah Jenkins","role":"Procurement Manager","action":"Approved","timestamp":"2026-06-26T16:00:00Z","comment":"Within local budget lines."}]','[]'),
('PR-5007','SOC 2 Audit Prep and Consultancy','IT','John Doe','Global Tech Solutions Inc.',75000,'Draft','Low','2026-06-27','2026-09-30','High','IT Software','Drafting of GRC controls framework and compliance consulting to prepare our systems for the SOC 2 audit next year.','[]','[]','[]','[]')
ON CONFLICT (id) DO NOTHING;

-- 4. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  role TEXT,
  action TEXT,
  module TEXT,
  description TEXT,
  ip_address TEXT DEFAULT '127.0.0.1',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO audit_logs (id, user_name, role, action, module, description, ip_address, timestamp) VALUES
('AUD-9001','John Doe','Employee','Submit Procurement Request','Procurement','Submitted PR-5003 for Nova Cloud Next-Gen Data Lake','192.168.1.45','2026-06-18T11:00:00Z'),
('AUD-9002','Marcus Vance','Compliance Officer','Flag Procurement Request','Compliance','Flagged PR-5003 due to expired vendor SOC 2 certification','192.168.1.12','2026-06-20T16:45:00Z'),
('AUD-9003','Sarah Jenkins','Procurement Manager','Send Back Request','Procurement','Sent back PR-5005 to Emily Blunt for granular fee breakdown','10.0.4.11','2026-06-24T15:20:00Z'),
('AUD-9004','David Gilmour','Employee','Submit Procurement Request','Procurement','Submitted PR-5006 for bulk office essentials','192.168.2.14','2026-06-25T08:15:00Z'),
('AUD-9005','Sarah Jenkins','Procurement Manager','Approve Procurement Request','Procurement','Approved PR-5006 for office essentials stationeries','10.0.4.11','2026-06-26T16:00:00Z'),
('AUD-9006','Alex Mercer','Administrator','Modify Settings','Administration','Updated system default procurement approval limit to $10,000','10.0.0.1','2026-06-27T09:00:00Z'),
('AUD-9007','Elena Rostova','Auditor','Export Report','Reports','Generated and downloaded Compliance Overview Q2 Report','192.168.1.112','2026-06-28T06:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- 5. RISK REGISTER
CREATE TABLE IF NOT EXISTS risk_register (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  probability INT DEFAULT 1,
  impact INT DEFAULT 1,
  score INT DEFAULT 1,
  severity TEXT DEFAULT 'Low',
  owner TEXT,
  status TEXT DEFAULT 'Open'
);

INSERT INTO risk_register (id, title, category, probability, impact, score, severity, owner, status) VALUES
('RSK-001','Vendor Data Leakage & Unauthorized Access','Data Privacy',3,5,15,'Critical','Marcus Vance','Monitoring'),
('RSK-002','Non-compliant Vendor Cloud Architecture','Compliance',4,5,20,'Critical','John Doe','Open'),
('RSK-003','Supply Chain Logistics Delay via Port Congestion','Operational',5,4,20,'Critical','Alice Cooper','Open'),
('RSK-004','Third-Party ISO Certification Expiry','Compliance',3,4,12,'High','Sarah Jenkins','Monitoring'),
('RSK-005','Single-source Software Lock-in','Financial',2,4,8,'High','David Gilmour','Monitoring'),
('RSK-006','Vendor Financial Insolvency','Financial',2,3,6,'Medium','Sarah Jenkins','Mitigated'),
('RSK-007','Stationery Price Inflation','Financial',2,1,2,'Low','Emily Blunt','Mitigated')
ON CONFLICT (id) DO NOTHING;

-- 6. COMPLIANCE ISSUES
CREATE TABLE IF NOT EXISTS compliance_issues (
  id TEXT PRIMARY KEY,
  requirement TEXT NOT NULL,
  entity TEXT,
  status TEXT DEFAULT 'Non-Compliant',
  due_date TEXT,
  owner TEXT,
  severity TEXT DEFAULT 'Medium'
);

INSERT INTO compliance_issues (id, requirement, entity, status, due_date, owner, severity) VALUES
('CMP-301','SOC 2 Type II Validation','Nova Cloud Infrastructure','Non-Compliant','2026-07-15','Marcus Vance','Critical'),
('CMP-302','ISO 27001 Re-certification','Global Tech Solutions Inc.','Under Review','2026-08-31','Sarah Jenkins','Medium'),
('CMP-303','Health & Safety Work-License Review','Apex Builders Ltd','Non-Compliant','2026-04-30','Marcus Vance','Critical'),
('CMP-304','GDPR Data Processing Agreement Update','Sinergy HR Consulting','Compliant','2026-10-01','Marcus Vance','High'),
('CMP-305','Supplier Code of Conduct Declaration','Prime Office Supplies','Compliant','2026-09-15','Elena Rostova','Low')
ON CONFLICT (id) DO NOTHING;

-- 7. DASHBOARD STATS (single config row)
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL
);

INSERT INTO dashboard_stats (id, data) VALUES (1, '{"kpis":{"totalRequests":7,"pendingRequests":1,"approvedRequests":2,"rejectedRequests":1,"totalVendors":6,"highRiskVendors":2,"complianceIssues":3,"openAuditFindings":2},"procurementTrend":[{"month":"Jan","amount":80000,"count":2},{"month":"Feb","amount":1200000,"count":1},{"month":"Mar","amount":214000,"count":2},{"month":"Apr","amount":45000,"count":1},{"month":"May","amount":0,"count":0},{"month":"Jun","amount":472000,"count":4}],"departmentSpending":[{"department":"IT","spend":540000,"color":"#3b82f6"},{"department":"Operations","spend":101000,"color":"#10b981"},{"department":"Facilities","spend":1200000,"color":"#f59e0b"},{"department":"Human Resources","spend":45000,"color":"#8b5cf6"},{"department":"Finance","spend":12000,"color":"#ec4899"}],"riskTrend":[{"month":"Jan","critical":0,"high":2,"medium":3},{"month":"Feb","critical":1,"high":2,"medium":3},{"month":"Mar","critical":1,"high":3,"medium":3},{"month":"Apr","critical":1,"high":3,"medium":4},{"month":"May","critical":1,"high":4,"medium":4},{"month":"Jun","critical":2,"high":4,"medium":5}],"complianceTrend":[{"month":"Jan","score":88},{"month":"Feb","score":85},{"month":"Mar","score":82},{"month":"Apr","score":83},{"month":"May","score":84},{"month":"Jun","score":84}]}')
ON CONFLICT (id) DO NOTHING;

-- 8. RISK DATA CONFIG (summary, matrix, categories)
CREATE TABLE IF NOT EXISTS risk_data_config (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL
);

INSERT INTO risk_data_config (id, data) VALUES (1, '{"summary":{"totalRisks":14,"criticalRisks":2,"highRisks":4,"mediumRisks":5,"lowRisks":3},"riskMatrix":[{"probability":1,"impact":1,"count":1,"severity":"Low"},{"probability":1,"impact":2,"count":1,"severity":"Low"},{"probability":1,"impact":3,"count":0,"severity":"Medium"},{"probability":1,"impact":4,"count":0,"severity":"High"},{"probability":1,"impact":5,"count":0,"severity":"High"},{"probability":2,"impact":1,"count":1,"severity":"Low"},{"probability":2,"impact":2,"count":2,"severity":"Medium"},{"probability":2,"impact":3,"count":1,"severity":"Medium"},{"probability":2,"impact":4,"count":1,"severity":"High"},{"probability":2,"impact":5,"count":0,"severity":"High"},{"probability":3,"impact":1,"count":0,"severity":"Low"},{"probability":3,"impact":2,"count":1,"severity":"Medium"},{"probability":3,"impact":3,"count":2,"severity":"Medium"},{"probability":3,"impact":4,"count":1,"severity":"High"},{"probability":3,"impact":5,"count":1,"severity":"Critical"},{"probability":4,"impact":1,"count":0,"severity":"Medium"},{"probability":4,"impact":2,"count":0,"severity":"Medium"},{"probability":4,"impact":3,"count":1,"severity":"High"},{"probability":4,"impact":4,"count":0,"severity":"High"},{"probability":4,"impact":5,"count":1,"severity":"Critical"},{"probability":5,"impact":1,"count":0,"severity":"Medium"},{"probability":5,"impact":2,"count":0,"severity":"High"},{"probability":5,"impact":3,"count":0,"severity":"High"},{"probability":5,"impact":4,"count":1,"severity":"Critical"},{"probability":5,"impact":5,"count":0,"severity":"Critical"}],"categories":[{"name":"Data Privacy","value":5,"color":"#3b82f6"},{"name":"Compliance","value":4,"color":"#10b981"},{"name":"Operational","value":3,"color":"#f59e0b"},{"name":"Financial","value":2,"color":"#ef4444"}]}')
ON CONFLICT (id) DO NOTHING;

-- 9. COMPLIANCE DATA CONFIG (summary, missing docs, expired certs, trend)
CREATE TABLE IF NOT EXISTS compliance_data_config (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL
);

INSERT INTO compliance_data_config (id, data) VALUES (1, '{"summary":{"complianceScore":84,"openViolations":3,"missingDocuments":5,"expiredCertificates":8,"resolvedIssues":12},"missingDocuments":[{"vendorId":"V-1004","vendorName":"Nova Cloud Infrastructure","documentName":"Liability Insurance Document","owner":"Kenji Sato","severity":"High"},{"vendorId":"V-1005","vendorName":"Apex Builders Ltd","documentName":"Liability Insurance Document","owner":"Robert Miller","severity":"Critical"}],"expiredCertificates":[{"vendorId":"V-1002","vendorName":"Apex Logistics Group","documentName":"ISO 9001 Certificate","expiredDate":"2026-03-01","owner":"Dieter Schwarz","severity":"Medium"},{"vendorId":"V-1002","vendorName":"Apex Logistics Group","documentName":"Compliance Declaration","expiredDate":"2026-02-10","owner":"Dieter Schwarz","severity":"Medium"},{"vendorId":"V-1004","vendorName":"Nova Cloud Infrastructure","documentName":"SOC 2 Type II Report","expiredDate":"2026-01-15","owner":"Kenji Sato","severity":"Critical"},{"vendorId":"V-1004","vendorName":"Nova Cloud Infrastructure","documentName":"ISO 27001 Certificate","expiredDate":"2026-05-30","owner":"Kenji Sato","severity":"High"},{"vendorId":"V-1005","vendorName":"Apex Builders Ltd","documentName":"H&S Certificate","expiredDate":"2025-11-30","owner":"Robert Miller","severity":"Critical"}],"trend":[{"month":"Jan","score":78},{"month":"Feb","score":80},{"month":"Mar","score":81},{"month":"Apr","score":82},{"month":"May","score":85},{"month":"Jun","score":84}]}')
ON CONFLICT (id) DO NOTHING;

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT,
  priority TEXT DEFAULT 'Low',
  read BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO notifications (id, title, message, type, priority, read, created_date) VALUES
('NOT-001','SOC 2 Certification Expired','Nova Cloud Infrastructure SOC 2 Type II report is expired. Check compliance dashboard.','Compliance','Critical',false,'2026-06-20T16:45:00Z'),
('NOT-002','PR-5005 Sent Back for Information','Your procurement request for Talent Sourcing Campaign has been sent back by Sarah Jenkins.','Procurement','Medium',false,'2026-06-24T15:20:00Z'),
('NOT-003','New Procurement Request for Approval','John Doe submitted PR-5003 Next-Gen Data Lake Storage Setup ($340,000) for review.','Procurement','High',false,'2026-06-18T11:02:00Z'),
('NOT-004','Compliance Issue Resolved','Global Tech Solutions submitted their ISO 27001 Re-certification. Status updated to compliant.','Compliance','Low',true,'2026-06-25T11:00:00Z'),
('NOT-005','Audit Logs Exported','System generated monthly audit snapshot for compliance archives.','Audit','Low',true,'2026-06-28T06:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- 11. REPORTS
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  module TEXT,
  created_by TEXT,
  created_date TEXT,
  format TEXT DEFAULT 'PDF'
);

INSERT INTO reports (id, name, module, created_by, created_date, format) VALUES
('REP-801','Procurement Spend Report Q1','Procurement','Sarah Jenkins','2026-04-01','CSV'),
('REP-802','Vendor Risk Matrix Summary','Vendor','Marcus Vance','2026-05-10','Excel'),
('REP-803','Compliance Violations & Actions Logs','Compliance','Marcus Vance','2026-06-25','PDF'),
('REP-804','Quarterly Internal Security & GRC Audit Report','Audit','Elena Rostova','2026-06-28','PDF')
ON CONFLICT (id) DO NOTHING;

-- 12. SENT EMAILS
CREATE TABLE IF NOT EXISTS sent_emails (
  id TEXT PRIMARY KEY,
  to_email TEXT NOT NULL,
  to_name TEXT,
  role TEXT,
  department TEXT,
  password TEXT,
  sent_by TEXT,
  subject TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for all tables (simple demo — anon key access)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_data_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_data_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- Allow full access via anon key for all tables
CREATE POLICY "Allow all access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON vendors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON procurement_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON risk_register FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON compliance_issues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON dashboard_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON risk_data_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON compliance_data_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON sent_emails FOR ALL USING (true) WITH CHECK (true);
