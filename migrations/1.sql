
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'employee',
  first_name TEXT,
  last_name TEXT,
  employee_id TEXT,
  phone TEXT,
  department TEXT,
  position TEXT,
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payslips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  uploaded_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salary_charts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE connection_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN DEFAULT true
);

CREATE TABLE password_reset_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  handled_by TEXT,
  handled_at DATETIME,
  status TEXT DEFAULT 'pending'
);
