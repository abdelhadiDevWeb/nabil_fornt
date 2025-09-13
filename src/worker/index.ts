import { Hono } from "hono";
import { cors } from 'hono/cors';
import { getCookie, setCookie } from "hono/cookie";

import { zValidator } from "@hono/zod-validator";
import {
  CreateUserSchema,
  UploadPayslipSchema,
  UploadSalaryChartSchema,
} from "@/shared/types";

type Variables = {
  currentUser?: any;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Helper function to get user from session
async function getCurrentUserFromSession(c: any) {
  const userSession = getCookie(c, 'user_session');
  if (!userSession) {
    return null;
  }

  try {
    const userData = JSON.parse(userSession);
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM users WHERE id = ? AND is_active = true"
    ).bind(userData.id).all();

    return results.length > 0 ? results[0] : null;
  } catch (error) {
    return null;
  }
}

// Log connection attempt
async function logConnection(c: any, email: string, success: boolean) {
  await c.env.DB.prepare(
    "INSERT INTO connection_logs (user_email, ip_address, user_agent, success) VALUES (?, ?, ?, ?)"
  ).bind(
    email,
    c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown',
    c.req.header('User-Agent') || 'unknown',
    success
  ).run();
}

// Note: Google OAuth endpoints disabled - only login/password authentication allowed
// OAuth routes (disabled for security - only DRH credentials allowed)
/*
app.get('/api/oauth/google/redirect_url', async (c) => {
  return c.json({ error: "Connexion Google OAuth désactivée. Utilisez vos identifiants fournis par le DRH." }, 403);
});

app.post("/api/sessions", async (c) => {
  return c.json({ error: "Connexion Google OAuth désactivée. Utilisez vos identifiants fournis par le DRH." }, 403);
});
*/

// Check current user session (for password-based auth)
app.get("/api/users/me", async (c) => {
  // Check if user is logged in via session
  const userSession = getCookie(c, 'user_session');
  if (!userSession) {
    return c.json({ error: "Non authentifié" }, 401);
  }

  try {
    const userData = JSON.parse(userSession);
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(userData.id).all();

    if (results.length === 0) {
      return c.json({ error: "Utilisateur non trouvé" }, 404);
    }

    return c.json({ user: results[0] });
  } catch (error) {
    return c.json({ error: "Session invalide" }, 401);
  }
});

app.get('/api/logout', async (c) => {
  setCookie(c, 'user_session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Admin-only routes
const adminMiddleware = async (c: any, next: any) => {
  const user = await getCurrentUserFromSession(c);
  if (!user) {
    return c.json({ error: "Non authentifié" }, 401);
  }

  if (user.role !== 'admin') {
    return c.json({ error: "Accès refusé - Droits administrateur requis" }, 403);
  }

  c.set('currentUser', user);
  await next();
};

// Employee authentication middleware
const employeeMiddleware = async (c: any, next: any) => {
  const user = await getCurrentUserFromSession(c);
  if (!user) {
    return c.json({ error: "Non authentifié" }, 401);
  }

  c.set('currentUser', user);
  await next();
};

// Get all employees (admin only)
app.get("/api/admin/employees", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM users ORDER BY created_at DESC"
  ).all();

  return c.json(results);
});

// Create employee (admin only)
app.post("/api/admin/employees", adminMiddleware, zValidator('json', CreateUserSchema), async (c) => {
  const data = c.req.valid('json');

  // Generate employee ID if not provided
  const employeeId = `EMP${Date.now()}`;
  
  // Generate email if not provided
  const email = data.email || `${employeeId.toLowerCase()}@anpt.dz`;

  // Hash the password (simple hashing for demo - in production use bcrypt or similar)
  const passwordHash = await crypto.subtle.digest(
    'SHA-256', 
    new TextEncoder().encode(data.password)
  ).then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));

  await c.env.DB.prepare(
    "INSERT INTO users (email, role, first_name, last_name, employee_id, login, password_hash, department, position, hire_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    email,
    'employee',
    data.first_name,
    data.last_name,
    employeeId,
    data.login,
    passwordHash,
    data.department || '',
    data.position || '',
    data.hire_date || new Date().toISOString().split('T')[0],
    true
  ).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM users WHERE employee_id = ?"
  ).bind(employeeId).all();

  return c.json({ 
    user: results[0], 
    message: `Employé créé avec succès. Email: ${email}, ID: ${employeeId}, Login: ${data.login}`,
    credentials: {
      email,
      employeeId,
      login: data.login,
      password: data.password
    }
  });
});

// Upload payslip (admin only)
app.post("/api/admin/payslips", adminMiddleware, zValidator('json', UploadPayslipSchema), async (c) => {
  const data = c.req.valid('json');
  const currentUser = c.get('currentUser');

  // In a real implementation, you would handle file upload here
  // For now, we'll create a placeholder entry
  const fileName = `payslip_${data.user_id}_${data.month}_${data.year}.pdf`;
  const fileUrl = `https://anpt.dz/payslips/${fileName}`;

  await c.env.DB.prepare(
    "INSERT INTO payslips (user_id, file_name, file_url, month, year, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(
    data.user_id,
    fileName,
    fileUrl,
    data.month,
    data.year,
    currentUser.email
  ).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM payslips WHERE user_id = ? AND month = ? AND year = ?"
  ).bind(data.user_id, data.month, data.year).all();

  return c.json(results[0]);
});

// Upload salary chart (admin only)
app.post("/api/admin/salary-charts", adminMiddleware, zValidator('json', UploadSalaryChartSchema), async (c) => {
  const data = c.req.valid('json');
  const currentUser = c.get('currentUser');

  // Deactivate previous charts
  await c.env.DB.prepare(
    "UPDATE salary_charts SET is_active = false"
  ).run();

  // In a real implementation, you would handle file upload here
  const fileName = `salary_chart_${Date.now()}.pdf`;
  const fileUrl = `https://anpt.dz/charts/${fileName}`;

  await c.env.DB.prepare(
    "INSERT INTO salary_charts (title, file_name, file_url, uploaded_by, is_active) VALUES (?, ?, ?, ?, ?)"
  ).bind(
    data.title,
    fileName,
    fileUrl,
    currentUser.email,
    true
  ).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM salary_charts WHERE is_active = true ORDER BY created_at DESC LIMIT 1"
  ).all();

  return c.json(results[0]);
});

// Get connection logs (admin only)
app.get("/api/admin/logs", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM connection_logs ORDER BY login_at DESC LIMIT 100"
  ).all();

  return c.json(results);
});

// Get password reset requests (admin only)
app.get("/api/admin/password-requests", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM password_reset_requests WHERE status = 'pending' ORDER BY requested_at DESC"
  ).all();

  return c.json(results);
});

// Employee routes
app.get("/api/employee/profile", employeeMiddleware, async (c) => {
  const user = c.get('currentUser');
  return c.json(user);
});

app.get("/api/employee/payslips", employeeMiddleware, async (c) => {
  const user = c.get('currentUser');
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM payslips WHERE user_id = ? ORDER BY year DESC, month DESC"
  ).bind(user.id).all();

  return c.json(results);
});

app.get("/api/employee/salary-chart", employeeMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM salary_charts WHERE is_active = true ORDER BY created_at DESC LIMIT 1"
  ).all();

  return c.json(results[0] || null);
});

// Submit password reset request
app.post("/api/employee/password-reset-request", async (c) => {
  const body = await c.req.json();
  const { email } = body;

  if (!email) {
    return c.json({ error: "Email requis" }, 400);
  }

  await c.env.DB.prepare(
    "INSERT INTO password_reset_requests (user_email, status) VALUES (?, ?)"
  ).bind(email, 'pending').run();

  return c.json({ 
    message: "Demande de réinitialisation envoyée. Un administrateur la traitera prochainement." 
  });
});

// ===== EVENTS MANAGEMENT =====

// Get all events (admin)
app.get("/api/admin/events", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM events ORDER BY event_date DESC"
  ).all();
  return c.json(results);
});

// Create event (admin)
app.post("/api/admin/events", adminMiddleware, async (c) => {
  const body = await c.req.json();
  const currentUser = c.get('currentUser');
  const { title, description, event_date, location } = body;

  await c.env.DB.prepare(
    "INSERT INTO events (title, description, event_date, location, created_by) VALUES (?, ?, ?, ?, ?)"
  ).bind(title, description, event_date, location, currentUser.email).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM events ORDER BY created_at DESC LIMIT 1"
  ).all();
  return c.json(results[0]);
});

// Update event (admin)
app.put("/api/admin/events/:id", adminMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { title, description, event_date, location, is_active } = body;

  await c.env.DB.prepare(
    "UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(title, description, event_date, location, is_active, id).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM events WHERE id = ?"
  ).bind(id).all();
  return c.json(results[0]);
});

// Delete event (admin)
app.delete("/api/admin/events/:id", adminMiddleware, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare("DELETE FROM events WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Get active events (employee)
app.get("/api/employee/events", employeeMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM events WHERE is_active = true ORDER BY event_date ASC"
  ).all();
  return c.json(results);
});

// ===== ANNOUNCEMENTS MANAGEMENT =====

// Get all announcements (admin)
app.get("/api/admin/announcements", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM announcements ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

// Create announcement (admin)
app.post("/api/admin/announcements", adminMiddleware, async (c) => {
  const body = await c.req.json();
  const currentUser = c.get('currentUser');
  const { title, content, priority } = body;

  await c.env.DB.prepare(
    "INSERT INTO announcements (title, content, priority, created_by) VALUES (?, ?, ?, ?)"
  ).bind(title, content, priority || 'normal', currentUser.email).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM announcements ORDER BY created_at DESC LIMIT 1"
  ).all();
  return c.json(results[0]);
});

// Update announcement (admin)
app.put("/api/admin/announcements/:id", adminMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { title, content, priority, is_active } = body;

  await c.env.DB.prepare(
    "UPDATE announcements SET title = ?, content = ?, priority = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(title, content, priority, is_active, id).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM announcements WHERE id = ?"
  ).bind(id).all();
  return c.json(results[0]);
});

// Delete announcement (admin)
app.delete("/api/admin/announcements/:id", adminMiddleware, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare("DELETE FROM announcements WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Get active announcements (employee)
app.get("/api/employee/announcements", employeeMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM announcements WHERE is_active = true ORDER BY priority DESC, created_at DESC"
  ).all();
  return c.json(results);
});

// ===== ADMINISTRATIVE DOCUMENTS MANAGEMENT =====

// Get all administrative documents (admin)
app.get("/api/admin/documents", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM administrative_documents ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

// Create administrative document (admin)
app.post("/api/admin/documents", adminMiddleware, async (c) => {
  const body = await c.req.json();
  const currentUser = c.get('currentUser');
  const { title, description, document_type } = body;

  // In real implementation, handle file upload here
  const fileName = `admin_doc_${Date.now()}.pdf`;
  const fileUrl = `https://anpt.dz/documents/${fileName}`;

  await c.env.DB.prepare(
    "INSERT INTO administrative_documents (title, description, file_name, file_url, document_type, created_by) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(title, description, fileName, fileUrl, document_type, currentUser.email).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM administrative_documents ORDER BY created_at DESC LIMIT 1"
  ).all();
  return c.json(results[0]);
});

// Update administrative document (admin)
app.put("/api/admin/documents/:id", adminMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { title, description, document_type, is_active } = body;

  await c.env.DB.prepare(
    "UPDATE administrative_documents SET title = ?, description = ?, document_type = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(title, description, document_type, is_active, id).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM administrative_documents WHERE id = ?"
  ).bind(id).all();
  return c.json(results[0]);
});

// Delete administrative document (admin)
app.delete("/api/admin/documents/:id", adminMiddleware, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare("DELETE FROM administrative_documents WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Get active administrative documents (employee)
app.get("/api/employee/documents", employeeMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM administrative_documents WHERE is_active = true ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

// ===== EMPLOYEE REQUESTS MANAGEMENT =====

// Get all employee requests (admin)
app.get("/api/admin/requests", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT er.*, u.first_name, u.last_name, u.employee_id 
     FROM employee_requests er 
     JOIN users u ON er.user_id = u.id 
     ORDER BY er.created_at DESC`
  ).all();
  return c.json(results);
});

// Handle employee request (admin)
app.put("/api/admin/requests/:id", adminMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const currentUser = c.get('currentUser');
  const { status, admin_response } = body;

  await c.env.DB.prepare(
    "UPDATE employee_requests SET status = ?, admin_response = ?, handled_by = ?, handled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(status, admin_response, currentUser.email, id).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM employee_requests WHERE id = ?"
  ).bind(id).all();
  return c.json(results[0]);
});

// Get employee's own requests
app.get("/api/employee/requests", employeeMiddleware, async (c) => {
  const user = c.get('currentUser');

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM employee_requests WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(user.id).all();
  return c.json(results);
});

// Create employee request
app.post("/api/employee/requests", employeeMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get('currentUser');
  const { request_type, title, description, request_data } = body;

  await c.env.DB.prepare(
    "INSERT INTO employee_requests (user_id, request_type, title, description, request_data) VALUES (?, ?, ?, ?, ?)"
  ).bind(user.id, request_type, title, description, JSON.stringify(request_data || {})).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM employee_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1"
  ).bind(user.id).all();
  return c.json(results[0]);
});

// Login with username/password (ONLY authentication method allowed)
app.post("/api/login", async (c) => {
  const body = await c.req.json();
  const { login, password } = body;

  if (!login || !password) {
    return c.json({ error: "Login et mot de passe requis" }, 400);
  }

  // Hash the provided password to compare
  const passwordHash = await crypto.subtle.digest(
    'SHA-256', 
    new TextEncoder().encode(password)
  ).then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM users WHERE login = ? AND password_hash = ? AND is_active = true"
  ).bind(login, passwordHash).all();

  if (results.length === 0) {
    await logConnection(c, login, false);
    return c.json({ error: "Identifiants incorrects ou compte désactivé" }, 401);
  }

  const user = results[0] as any;
  await logConnection(c, user.email, true);

  // Create session cookie
  const sessionData = {
    id: user.id,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name
  };

  setCookie(c, 'user_session', JSON.stringify(sessionData), {
    httpOnly: true,
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
    secure: true,
    sameSite: 'strict'
  });

  return c.json({ 
    success: true, 
    user: sessionData
  });
});

export default {
  fetch: app.fetch,
};
