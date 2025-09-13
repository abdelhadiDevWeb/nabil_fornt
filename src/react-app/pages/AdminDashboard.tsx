import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Users, 
  Plus, 
  Upload, 
  FileText, 
  BarChart3, 
  Activity, 
  AlertCircle, 
  LogOut, 
  Shield,
  Calendar,
  Megaphone,
  FileCheck,
  Send,
  Edit3,
  Trash2
} from 'lucide-react';
import { getApiUrl } from '@/shared/config';

interface User {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  department: string;
  position: string;
  hire_date: string;
  is_active: boolean;
  created_at: string;
}

interface ConnectionLog {
  id: number;
  user_email: string;
  ip_address: string;
  login_at: string;
  success: boolean;
}

interface PasswordRequest {
  id: number;
  user_email: string;
  requested_at: string;
  status: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
}

interface AdminDocument {
  id: number;
  title: string;
  description: string;
  file_name: string;
  file_url: string;
  document_type: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
}

interface EmployeeRequest {
  id: number;
  user_id: number;
  request_type: string;
  title: string;
  description: string;
  request_data: string;
  status: string;
  handled_by: string;
  handled_at: string;
  admin_response: string;
  created_at: string;
  first_name: string;
  last_name: string;
  employee_id: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState<User[]>([]);
  const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([]);
  const [passwordRequests, setPasswordRequests] = useState<PasswordRequest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [adminDocuments, setAdminDocuments] = useState<AdminDocument[]>([]);
  const [employeeRequests, setEmployeeRequests] = useState<EmployeeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Add employee form state
  const [addEmployeeForm, setAddEmployeeForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    login: '',
    password: '',
    department: '',
    position: '',
    hire_date: new Date().toISOString().split('T')[0]
  });

  // Payslip upload form state
  const [payslipForm, setPayslipForm] = useState({
    user_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    file: null as File | null
  });

  // Upload states
  const [uploadMessage, setUploadMessage] = useState('');
  const [salaryChartForm, setSalaryChartForm] = useState({
    title: ''
  });

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: ''
  });

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal'
  });

  // Document form state
  const [documentForm, setDocumentForm] = useState({
    title: '',
    description: '',
    document_type: ''
  });

  // Request handling state
  const [requestResponse, setRequestResponse] = useState({
    id: '',
    status: '',
    admin_response: ''
  });

  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    try {
      const response = await fetch(getApiUrl('/api/users/me'));
      const data = await response.json();
      
      if (!data.user || data.user.role !== 'admin') {
        navigate('/login');
        return;
      }
      
      setCurrentUser(data.user);
      await Promise.all([
        fetchEmployees(),
        fetchConnectionLogs(),
        fetchPasswordRequests(),
        fetchEvents(),
        fetchAnnouncements(),
        fetchAdminDocuments(),
        fetchEmployeeRequests()
      ]);
    } catch (error) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/employees'));
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchConnectionLogs = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/logs'));
      const data = await response.json();
      setConnectionLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchPasswordRequests = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/password-requests'));
      const data = await response.json();
      setPasswordRequests(data);
    } catch (error) {
      console.error('Error fetching password requests:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/events'));
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/announcements'));
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchAdminDocuments = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/documents'));
      const data = await response.json();
      setAdminDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchEmployeeRequests = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/requests'));
      const data = await response.json();
      setEmployeeRequests(data);
    } catch (error) {
      console.error('Error fetching employee requests:', error);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl('/api/admin/employees'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addEmployeeForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadMessage(`Employé créé avec succès! Email: ${data.credentials.email}, ID: ${data.credentials.employeeId}`);
        setAddEmployeeForm({
          first_name: '',
          last_name: '',
          email: '',
          login: '',
          password: '',
          department: '',
          position: '',
          hire_date: new Date().toISOString().split('T')[0]
        });
        await fetchEmployees();
      } else {
        setUploadMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage('Erreur lors de la création de l\'employé');
    }
  };

  const handleUploadPayslip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payslipForm.user_id || !payslipForm.file) {
      setUploadMessage('Erreur: Veuillez sélectionner un employé et un fichier');
      return;
    }

    try {
      // In a real implementation, you would upload the file here
      // For demo purposes, we'll simulate the upload
      const response = await fetch(getApiUrl('/api/admin/payslips'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(payslipForm.user_id),
          month: payslipForm.month,
          year: payslipForm.year
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadMessage('Fiche de paie téléchargée avec succès!');
        setPayslipForm({
          user_id: '',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          file: null
        });
      } else {
        setUploadMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage('Erreur lors du téléchargement de la fiche de paie');
    }
  };

  const handleUploadSalaryChart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl('/api/admin/salary-charts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salaryChartForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadMessage('Charte salariale mise à jour avec succès!');
        setSalaryChartForm({ title: '' });
      } else {
        setUploadMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage('Erreur lors du téléchargement');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl('/api/admin/events'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadMessage('Événement créé avec succès!');
        setEventForm({
          title: '',
          description: '',
          event_date: '',
          location: ''
        });
        await fetchEvents();
      } else {
        setUploadMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage('Erreur lors de la création de l\'événement');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl('/api/admin/announcements'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadMessage('Annonce créée avec succès!');
        setAnnouncementForm({
          title: '',
          content: '',
          priority: 'normal'
        });
        await fetchAnnouncements();
      } else {
        setUploadMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage('Erreur lors de la création de l\'annonce');
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl('/api/admin/documents'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadMessage('Document créé avec succès!');
        setDocumentForm({
          title: '',
          description: '',
          document_type: ''
        });
        await fetchAdminDocuments();
      } else {
        setUploadMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage('Erreur lors de la création du document');
    }
  };

  const handleRequestResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl(`/api/admin/requests/${requestResponse.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: requestResponse.status,
          admin_response: requestResponse.admin_response
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadMessage('Demande traitée avec succès!');
        setRequestResponse({
          id: '',
          status: '',
          admin_response: ''
        });
        await fetchEmployeeRequests();
      } else {
        setUploadMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage('Erreur lors du traitement de la demande');
    }
  };

  const handleLogout = async () => {
    await fetch(getApiUrl('/api/logout'));
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://mocha-cdn.com/01987424-b707-7509-9ec8-32da1056e699/logo_anpt_02-(1).png" 
                alt="ANPT Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  SirteRH - Administration DRH
                </h1>
                <p className="text-sm text-gray-600">Bienvenue, {currentUser?.first_name || 'Administrateur'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'employees', label: 'Employés', icon: Users },
              { id: 'add-employee', label: 'Ajouter Employé', icon: Plus },
              { id: 'payslips', label: 'Fiches de Paie', icon: FileText },
              { id: 'salary-chart', label: 'Charte Salariale', icon: Upload },
              { id: 'events', label: 'Événements', icon: Calendar },
              { id: 'announcements', label: 'Annonces', icon: Megaphone },
              { id: 'documents', label: 'Documents Admin', icon: FileCheck },
              { id: 'employee-requests', label: 'Demandes Employés', icon: Send },
              { id: 'logs', label: 'Journaux', icon: Activity },
              { id: 'requests', label: 'Demandes MDP', icon: AlertCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employés</p>
                    <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Employés Actifs</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {employees.filter(emp => emp.is_active).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Demandes Employés</p>
                    <p className="text-3xl font-bold text-gray-900">{employeeRequests.filter(req => req.status === 'pending').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connexions Aujourd'hui</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {connectionLogs.filter(log => 
                        new Date(log.login_at).toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Liste des Employés</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Département
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Poste
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.first_name} {employee.last_name}
                            </div>
                            <div className="text-sm text-gray-500">ID: {employee.employee_id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.department || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.position || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Employee Tab */}
          {activeTab === 'add-employee' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un Nouvel Employé</h2>
              
              <form onSubmit={handleAddEmployee} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={addEmployeeForm.first_name}
                      onChange={(e) => setAddEmployeeForm({...addEmployeeForm, first_name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={addEmployeeForm.last_name}
                      onChange={(e) => setAddEmployeeForm({...addEmployeeForm, last_name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      value={addEmployeeForm.email}
                      onChange={(e) => setAddEmployeeForm({...addEmployeeForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Si vide, sera généré automatiquement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Login *
                    </label>
                    <input
                      type="text"
                      value={addEmployeeForm.login}
                      onChange={(e) => setAddEmployeeForm({...addEmployeeForm, login: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom d'utilisateur pour la connexion"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      value={addEmployeeForm.password}
                      onChange={(e) => setAddEmployeeForm({...addEmployeeForm, password: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mot de passe pour l'employé"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Département
                    </label>
                    <input
                      type="text"
                      value={addEmployeeForm.department}
                      onChange={(e) => setAddEmployeeForm({...addEmployeeForm, department: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poste
                    </label>
                    <input
                      type="text"
                      value={addEmployeeForm.position}
                      onChange={(e) => setAddEmployeeForm({...addEmployeeForm, position: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'embauche
                    </label>
                    <input
                      type="date"
                      value={addEmployeeForm.hire_date}
                      onChange={(e) => setAddEmployeeForm({...addEmployeeForm, hire_date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Créer l'Employé
                </button>
              </form>

              {uploadMessage && (
                <div className={`mt-6 p-4 rounded-lg ${
                  uploadMessage.includes('Erreur') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {uploadMessage}
                </div>
              )}
            </div>
          )}

          {/* Payslips Tab */}
          {activeTab === 'payslips' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Télécharger une Fiche de Paie</h2>
              
              <form onSubmit={handleUploadPayslip} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employé *
                    </label>
                    <select
                      value={payslipForm.user_id}
                      onChange={(e) => setPayslipForm({...payslipForm, user_id: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Sélectionner un employé</option>
                      {employees.filter(emp => emp.role === 'employee').map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name} - {employee.employee_id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mois *
                    </label>
                    <select
                      value={payslipForm.month}
                      onChange={(e) => setPayslipForm({...payslipForm, month: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {new Date(2024, month - 1).toLocaleDateString('fr-FR', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année *
                    </label>
                    <select
                      value={payslipForm.year}
                      onChange={(e) => setPayslipForm({...payslipForm, year: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier PDF *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPayslipForm({...payslipForm, file: e.target.files?.[0] || null})}
                      className="hidden"
                      id="payslip-file"
                      required
                    />
                    <label htmlFor="payslip-file" className="cursor-pointer">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {payslipForm.file ? payslipForm.file.name : 'Cliquez pour sélectionner un fichier'}
                      </p>
                      <p className="text-gray-600 mb-4">ou glissez et déposez votre fichier PDF ici</p>
                      <p className="text-sm text-gray-500">Format accepté: PDF uniquement</p>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Télécharger la Fiche de Paie
                </button>
              </form>

              {uploadMessage && (
                <div className={`mt-6 p-4 rounded-lg ${
                  uploadMessage.includes('Erreur') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {uploadMessage}
                </div>
              )}
            </div>
          )}

          {/* Salary Chart Tab */}
          {activeTab === 'salary-chart' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion de la Charte Salariale</h2>
              
              <form onSubmit={handleUploadSalaryChart} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la charte *
                  </label>
                  <input
                    type="text"
                    value={salaryChartForm.title}
                    onChange={(e) => setSalaryChartForm({...salaryChartForm, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ex: Grille salariale 2024"
                    required
                  />
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Zone de téléchargement</p>
                  <p className="text-gray-600 mb-4">Glissez et déposez votre fichier PDF ici</p>
                  <p className="text-sm text-gray-500">
                    Note: Dans cette version de démonstration, le fichier sera simulé
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Mettre à jour la Charte Salariale
                </button>
              </form>

              {uploadMessage && (
                <div className={`mt-6 p-4 rounded-lg ${
                  uploadMessage.includes('Erreur') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {uploadMessage}
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-8">
              {/* Create Event Form */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un Événement</h2>
                
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre de l'événement *
                      </label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de l'événement *
                      </label>
                      <input
                        type="date"
                        value={eventForm.event_date}
                        onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lieu
                      </label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Lieu de l'événement"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description de l'événement..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Créer l'Événement
                  </button>
                </form>

                {uploadMessage && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    uploadMessage.includes('Erreur') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {uploadMessage}
                  </div>
                )}
              </div>

              {/* Events List */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Liste des Événements</h2>
                </div>
                <div className="p-6">
                  {events.length > 0 ? (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                              {event.description && (
                                <p className="text-gray-600 mb-3">{event.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>📅 {new Date(event.event_date).toLocaleDateString('fr-FR')}</span>
                                {event.location && <span>📍 {event.location}</span>}
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  event.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {event.is_active ? 'Actif' : 'Inactif'}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun événement créé</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-8">
              {/* Create Announcement Form */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer une Annonce</h2>
                
                <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre de l'annonce *
                      </label>
                      <input
                        type="text"
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priorité
                      </label>
                      <select
                        value={announcementForm.priority}
                        onChange={(e) => setAnnouncementForm({...announcementForm, priority: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="medium">Important</option>
                        <option value="high">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu de l'annonce *
                    </label>
                    <textarea
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contenu de l'annonce..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Publier l'Annonce
                  </button>
                </form>

                {uploadMessage && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    uploadMessage.includes('Erreur') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {uploadMessage}
                  </div>
                )}
              </div>

              {/* Announcements List */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Liste des Annonces</h2>
                </div>
                <div className="p-6">
                  {announcements.length > 0 ? (
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                                  {announcement.priority === 'high' ? 'Urgent' :
                                   announcement.priority === 'medium' ? 'Important' : 'Normal'}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {announcement.is_active ? 'Actif' : 'Inactif'}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3 whitespace-pre-wrap">{announcement.content}</p>
                              <p className="text-sm text-gray-500">
                                Publié le {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune annonce créée</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Administrative Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-8">
              {/* Create Document Form */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Publier un Document Administratif</h2>
                
                <form onSubmit={handleCreateDocument} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du document *
                      </label>
                      <input
                        type="text"
                        value={documentForm.title}
                        onChange={(e) => setDocumentForm({...documentForm, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de document *
                      </label>
                      <select
                        value={documentForm.document_type}
                        onChange={(e) => setDocumentForm({...documentForm, document_type: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="decision">Décision administrative</option>
                        <option value="circular">Circulaire</option>
                        <option value="regulation">Règlement</option>
                        <option value="procedure">Procédure</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={documentForm.description}
                      onChange={(e) => setDocumentForm({...documentForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description du document..."
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Zone de téléchargement</p>
                    <p className="text-gray-600 mb-4">Glissez et déposez votre fichier PDF ici</p>
                    <p className="text-sm text-gray-500">
                      Note: Dans cette version de démonstration, le fichier sera simulé
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Publier le Document
                  </button>
                </form>

                {uploadMessage && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    uploadMessage.includes('Erreur') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {uploadMessage}
                  </div>
                )}
              </div>

              {/* Documents List */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Documents Administratifs</h2>
                </div>
                <div className="p-6">
                  {adminDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {adminDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                              <FileCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex space-x-1">
                              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mb-2 inline-block">
                            {doc.document_type}
                          </span>
                          {doc.description && (
                            <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              doc.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {doc.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun document administratif publié</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Employee Requests Tab */}
          {activeTab === 'employee-requests' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Demandes des Employés</h2>
              </div>
              <div className="p-6">
                {employeeRequests.length > 0 ? (
                  <div className="space-y-4">
                    {employeeRequests.map((request) => (
                      <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {request.request_type === 'leave' ? 'Congé' : 
                                 request.request_type === 'document' ? 'Document RH' : 'Autre'}
                              </span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                {request.status === 'completed' || request.status === 'approved' ? 'Approuvée' :
                                 request.status === 'rejected' ? 'Rejetée' : 'En attente'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Demandeur: {request.first_name} {request.last_name} ({request.employee_id})
                            </p>
                            {request.description && (
                              <p className="text-gray-700 mb-3">{request.description}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              Soumise le {new Date(request.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setRequestResponse({
                                id: request.id.toString(),
                                status: 'approved',
                                admin_response: ''
                              })}
                              className="px-3 py-1 text-green-600 hover:bg-green-50 rounded border border-green-200"
                            >
                              Approuver
                            </button>
                            <button 
                              onClick={() => setRequestResponse({
                                id: request.id.toString(),
                                status: 'rejected',
                                admin_response: ''
                              })}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded border border-red-200"
                            >
                              Rejeter
                            </button>
                          </div>
                        </div>
                        
                        {requestResponse.id === request.id.toString() && (
                          <form onSubmit={handleRequestResponse} className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="mb-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Réponse administrative
                              </label>
                              <textarea
                                value={requestResponse.admin_response}
                                onChange={(e) => setRequestResponse({...requestResponse, admin_response: e.target.value})}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Votre réponse à l'employé..."
                                required
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Envoyer la réponse
                              </button>
                              <button
                                type="button"
                                onClick={() => setRequestResponse({id: '', status: '', admin_response: ''})}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Annuler
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune demande d'employé</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connection Logs Tab */}
          {activeTab === 'logs' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Journaux de Connexion</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date/Heure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {connectionLogs.slice(0, 20).map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.user_email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ip_address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.login_at).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            log.success 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.success ? 'Succès' : 'Échec'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Password Requests Tab */}
          {activeTab === 'requests' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Demandes de Réinitialisation</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de demande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {passwordRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.user_email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.requested_at).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            En attente
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-green-600 hover:text-green-800 font-medium">
                            Traiter
                          </button>
                          <button className="text-red-600 hover:text-red-800 font-medium">
                            Rejeter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {passwordRequests.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    Aucune demande en attente
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
