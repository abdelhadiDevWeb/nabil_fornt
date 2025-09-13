import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  User, 
  FileText, 
  Download, 
  BarChart3, 
  LogOut, 
  Calendar,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Clock,
  Megaphone,
  FileCheck,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getApiUrl } from '@/shared/config';

interface UserProfile {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  department: string;
  position: string;
  hire_date: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

interface Payslip {
  id: number;
  user_id: number;
  file_name: string;
  file_url: string;
  month: number;
  year: number;
  uploaded_by: string;
  created_at: string;
}

interface SalaryChart {
  id: number;
  title: string;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  is_active: boolean;
  created_at: string;
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
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [salaryChart, setSalaryChart] = useState<SalaryChart | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [adminDocuments, setAdminDocuments] = useState<AdminDocument[]>([]);
  const [myRequests, setMyRequests] = useState<EmployeeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // New request form state
  const [newRequestForm, setNewRequestForm] = useState({
    request_type: '',
    title: '',
    description: '',
    document_types: [] as string[]
  });
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const response = await fetch(getApiUrl('/api/users/me'));
      const data = await response.json();
      
      if (!data.user) {
        navigate('/login');
        return;
      }
      
      await Promise.all([
        fetchProfile(),
        fetchPayslips(),
        fetchSalaryChart(),
        fetchEvents(),
        fetchAnnouncements(),
        fetchAdminDocuments(),
        fetchMyRequests()
      ]);
    } catch (error) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(getApiUrl('/api/employee/profile'));
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPayslips = async () => {
    try {
      const response = await fetch(getApiUrl('/api/employee/payslips'));
      const data = await response.json();
      setPayslips(data);
    } catch (error) {
      console.error('Error fetching payslips:', error);
    }
  };

  const fetchSalaryChart = async () => {
    try {
      const response = await fetch(getApiUrl('/api/employee/salary-chart'));
      const data = await response.json();
      setSalaryChart(data);
    } catch (error) {
      console.error('Error fetching salary chart:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(getApiUrl('/api/employee/events'));
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(getApiUrl('/api/employee/announcements'));
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchAdminDocuments = async () => {
    try {
      const response = await fetch(getApiUrl('/api/employee/documents'));
      const data = await response.json();
      setAdminDocuments(data);
    } catch (error) {
      console.error('Error fetching admin documents:', error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const response = await fetch(getApiUrl('/api/employee/requests'));
      const data = await response.json();
      setMyRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl('/api/employee/requests'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_type: newRequestForm.request_type,
          title: newRequestForm.title,
          description: newRequestForm.description,
          request_data: { document_types: newRequestForm.document_types }
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setRequestMessage('Demande soumise avec succès!');
        setNewRequestForm({
          request_type: '',
          title: '',
          description: '',
          document_types: []
        });
        await fetchMyRequests();
      } else {
        setRequestMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setRequestMessage('Erreur lors de la soumission de la demande');
    }
  };

  const handleLogout = async () => {
    await fetch(getApiUrl('/api/logout'));
    navigate('/');
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
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
                  SirteRH - Espace Employé
                </h1>
                <p className="text-sm text-gray-600">
                  Bienvenue, {userProfile?.first_name} {userProfile?.last_name}
                </p>
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
              { id: 'profile', label: 'Mon Profil', icon: User },
              { id: 'payslips', label: 'Fiches de Paie', icon: FileText },
              { id: 'salary-chart', label: 'Charte Salariale', icon: BarChart3 },
              { id: 'events', label: 'Événements', icon: Calendar },
              { id: 'announcements', label: 'Annonces', icon: Megaphone },
              { id: 'documents', label: 'Documents Admin', icon: FileCheck },
              { id: 'requests', label: 'Mes Demandes', icon: Send },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && userProfile && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Mon Profil</h2>
                <p className="text-blue-100">Informations personnelles et professionnelles</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Informations Personnelles
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nom complet</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userProfile.first_name} {userProfile.last_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Adresse email</p>
                          <p className="text-lg font-semibold text-gray-900">{userProfile.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Téléphone</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userProfile.phone || 'Non renseigné'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Informations Professionnelles
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">ID Employé</p>
                          <p className="text-lg font-semibold text-gray-900">{userProfile.employee_id}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Département</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userProfile.department || 'Non assigné'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Poste</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userProfile.position || 'Non défini'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date d'embauche</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userProfile.hire_date 
                              ? new Date(userProfile.hire_date).toLocaleDateString('fr-FR')
                              : 'Non renseignée'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Statut du compte</h3>
                      <p className="text-gray-600">État actuel de votre compte employé</p>
                    </div>
                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                      userProfile.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userProfile.is_active ? 'Compte Actif' : 'Compte Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payslips Tab */}
          {activeTab === 'payslips' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Mes Fiches de Paie</h2>
                <p className="text-blue-100">Consultez et téléchargez vos bulletins de salaire</p>
              </div>

              <div className="p-8">
                {payslips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {payslips.map((payslip) => (
                      <div
                        key={payslip.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-500">
                            {getMonthName(payslip.month)} {payslip.year}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Fiche de Paie
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Téléchargé le {new Date(payslip.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        
                        <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Télécharger PDF</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune fiche de paie disponible
                    </h3>
                    <p className="text-gray-600">
                      Vos fiches de paie apparaîtront ici une fois qu'elles seront téléchargées par l'administration.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Salary Chart Tab */}
          {activeTab === 'salary-chart' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Charte Salariale</h2>
                <p className="text-purple-100">Grille des salaires et barèmes de l'ANPT</p>
              </div>

              <div className="p-8">
                {salaryChart ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{salaryChart.title}</h3>
                          <p className="text-gray-600">
                            Mis à jour le {new Date(salaryChart.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Télécharger</span>
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Document officiel</span>
                      </div>
                      <p className="text-purple-700">
                        Cette charte salariale contient les barèmes et grilles de salaires 
                        officiels de l'ANPT. Elle est mise à jour régulièrement par le service RH.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Charte salariale non disponible
                    </h3>
                    <p className="text-gray-600">
                      La charte salariale n'a pas encore été téléchargée par l'administration. 
                      Veuillez contacter le service RH pour plus d'informations.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Événements</h2>
                <p className="text-indigo-100">Calendrier des événements de l'ANPT</p>
              </div>

              <div className="p-8">
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                              {event.description && (
                                <p className="text-gray-600 mb-3">{event.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(event.event_date).toLocaleDateString('fr-FR')}</span>
                                </span>
                                {event.location && (
                                  <span className="flex items-center space-x-1">
                                    <Building2 className="w-4 h-4" />
                                    <span>{event.location}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun événement à venir
                    </h3>
                    <p className="text-gray-600">
                      Les événements de l'ANPT apparaîtront ici dès qu'ils seront programmés.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Annonces</h2>
                <p className="text-orange-100">Communications officielles de l'ANPT</p>
              </div>

              <div className="p-8">
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className={`border-l-4 rounded-lg p-6 ${getPriorityColor(announcement.priority)}`}>
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                            announcement.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {announcement.priority === 'high' ? 'Urgent' :
                             announcement.priority === 'medium' ? 'Important' : 'Normal'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                        <p className="text-sm text-gray-500">
                          Publié le {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune annonce
                    </h3>
                    <p className="text-gray-600">
                      Les annonces de l'administration apparaîtront ici.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Administrative Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Documents Administratifs</h2>
                <p className="text-teal-100">Décisions et documents officiels vous concernant</p>
              </div>

              <div className="p-8">
                {adminDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminDocuments.map((doc) => (
                      <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <FileCheck className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {doc.document_type}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mb-4">
                          Publié le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        
                        <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Télécharger</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun document administratif
                    </h3>
                    <p className="text-gray-600">
                      Les documents et décisions administratives vous concernant apparaîtront ici.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* My Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-8">
              {/* Submit New Request */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle Demande</h2>
                
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de demande *
                    </label>
                    <select
                      value={newRequestForm.request_type}
                      onChange={(e) => setNewRequestForm({...newRequestForm, request_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="leave">Demande de congé</option>
                      <option value="document">Demande de document RH</option>
                      <option value="other">Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de la demande *
                    </label>
                    <input
                      type="text"
                      value={newRequestForm.title}
                      onChange={(e) => setNewRequestForm({...newRequestForm, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Résumé de votre demande"
                      required
                    />
                  </div>

                  {newRequestForm.request_type === 'document' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documents demandés
                      </label>
                      <div className="space-y-2">
                        {['Attestation de travail', 'Relevé de salaire', 'Certificat de congé', 'Autre document'].map((docType) => (
                          <label key={docType} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newRequestForm.document_types.includes(docType)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRequestForm({
                                    ...newRequestForm,
                                    document_types: [...newRequestForm.document_types, docType]
                                  });
                                } else {
                                  setNewRequestForm({
                                    ...newRequestForm,
                                    document_types: newRequestForm.document_types.filter(type => type !== docType)
                                  });
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">{docType}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description détaillée
                    </label>
                    <textarea
                      value={newRequestForm.description}
                      onChange={(e) => setNewRequestForm({...newRequestForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Expliquez votre demande en détail..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Soumettre la demande</span>
                  </button>
                </form>

                {requestMessage && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    requestMessage.includes('Erreur') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {requestMessage}
                  </div>
                )}
              </div>

              {/* My Requests List */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Mes Demandes</h2>
                  <p className="text-blue-100">Suivi de vos demandes soumises</p>
                </div>

                <div className="p-8">
                  {myRequests.length > 0 ? (
                    <div className="space-y-4">
                      {myRequests.map((request) => (
                        <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
                              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {request.request_type === 'leave' ? 'Congé' : 
                                 request.request_type === 'document' ? 'Document RH' : 'Autre'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(request.status)}
                              <span className={`text-sm font-medium ${
                                request.status === 'completed' || request.status === 'approved' ? 'text-green-600' :
                                request.status === 'rejected' ? 'text-red-600' : 'text-orange-600'
                              }`}>
                                {getStatusText(request.status)}
                              </span>
                            </div>
                          </div>

                          {request.description && (
                            <p className="text-gray-600 mb-4">{request.description}</p>
                          )}

                          {request.admin_response && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Réponse de l'administration :</h4>
                              <p className="text-gray-700">{request.admin_response}</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Soumise le {new Date(request.created_at).toLocaleDateString('fr-FR')}</span>
                            {request.handled_at && (
                              <span>Traitée le {new Date(request.handled_at).toLocaleDateString('fr-FR')}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucune demande soumise
                      </h3>
                      <p className="text-gray-600">
                        Vos demandes apparaîtront ici après leur soumission.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
