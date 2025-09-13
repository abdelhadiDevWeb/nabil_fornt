import z from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  role: z.enum(['admin', 'hr', 'manager', 'employee']),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  employee_id: z.string().nullable(),
  phone: z.string().nullable(),
  department: z.string().nullable(),
  position: z.string().nullable(),
  hire_date: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const PayslipSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  file_name: z.string(),
  file_url: z.string(),
  month: z.number().min(1).max(12),
  year: z.number(),
  uploaded_by: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const SalaryChartSchema = z.object({
  id: z.number(),
  title: z.string(),
  file_name: z.string(),
  file_url: z.string(),
  uploaded_by: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ConnectionLogSchema = z.object({
  id: z.number(),
  user_email: z.string(),
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
  login_at: z.string(),
  success: z.boolean(),
});

export const PasswordResetRequestSchema = z.object({
  id: z.number(),
  user_email: z.string(),
  requested_at: z.string(),
  handled_by: z.string().nullable(),
  handled_at: z.string().nullable(),
  status: z.enum(['pending', 'completed', 'rejected']),
});

export const CreateUserSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide").optional(),
  login: z.string().min(3, "Le login doit contenir au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  department: z.string().optional(),
  position: z.string().optional(),
  hire_date: z.string().optional(),
});

export const UploadPayslipSchema = z.object({
  user_id: z.number(),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2030),
});

export const UploadSalaryChartSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
});

export type User = z.infer<typeof UserSchema>;
export type Payslip = z.infer<typeof PayslipSchema>;
export type SalaryChart = z.infer<typeof SalaryChartSchema>;
export type ConnectionLog = z.infer<typeof ConnectionLogSchema>;
export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UploadPayslip = z.infer<typeof UploadPayslipSchema>;
export type UploadSalaryChart = z.infer<typeof UploadSalaryChartSchema>;
