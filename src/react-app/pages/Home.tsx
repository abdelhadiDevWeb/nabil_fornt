import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { Building2, Users, Shield, FileText, BarChart3, Clock } from 'lucide-react';
import { getApiUrl } from '@/shared/config';

export default function Home() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && user) {
      // Get user role from localStorage or fetch from API
      fetch(getApiUrl('/api/users/me'))
        .then(res => res.json())
        .then(data => {
          if (data.user?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/employee/dashboard');
          }
        })
        .catch(() => {
          navigate('/login');
        });
    }
  }, [user, isPending, navigate]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://mocha-cdn.com/01987424-b707-7509-9ec8-32da1056e699/logo_anpt_02-(1).png" 
                alt="ANPT Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  SirteRH
                </h1>
                <p className="text-sm text-gray-600">Système de Gestion RH</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plateforme de Gestion
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Ressources Humaines
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Solution complète et sécurisée pour la gestion des employés, fiches de paie, 
            et processus RH au sein de l'ANPT (Agence Nationale pour la Promotion et le Développement des Parcs Technologiques).
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              Accéder à la plateforme
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestion des Employés</h3>
            <p className="text-gray-600">
              Créez et gérez les profils d'employés, générez automatiquement les identifiants de connexion et gérez les accès.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Fiches de Paie</h3>
            <p className="text-gray-600">
              Téléchargez et gérez les fiches de paie des employés avec un système sécurisé de stockage et d'accès.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Charte Salariale</h3>
            <p className="text-gray-600">
              Gérez et partagez la grille de salaires avec tous les employés de manière transparente et sécurisée.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sécurité Avancée</h3>
            <p className="text-gray-600">
              Authentification sécurisée, gestion des rôles, journalisation des connexions et protection des données.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestion des Demandes</h3>
            <p className="text-gray-600">
              Système de demandes RH avec suivi, notifications et gestion des réinitialisations de mot de passe.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interface Moderne</h3>
            <p className="text-gray-600">
              Interface responsive et intuitive adaptée aux besoins des utilisateurs administrateurs et employés.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Prêt à commencer ?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Accédez à votre espace personnel ou administrateur pour gérer vos ressources humaines.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Se connecter maintenant
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="https://mocha-cdn.com/01987424-b707-7509-9ec8-32da1056e699/logo_anpt_02-(1).png" 
                alt="ANPT Logo" 
                className="h-8 w-auto"
              />
              <div>
                <p className="font-semibold">SirteRH - ANPT</p>
                <p className="text-sm text-gray-400">Agence Nationale pour la Promotion et le Développement des Parcs Technologiques</p>
              </div>
            </div>
            <p className="text-gray-400">
              © 2024 ANPT. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
