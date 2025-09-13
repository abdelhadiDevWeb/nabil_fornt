import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogIn, Lock, ArrowLeft } from 'lucide-react';
import { getApiUrl } from '@/shared/config';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showLocalLogin, setShowLocalLogin] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [loginForm, setLoginForm] = useState({
    login: '',
    password: ''
  });
  const [loginMessage, setLoginMessage] = useState('');

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store user info in sessionStorage for demo purposes
        sessionStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        setLoginMessage(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      setLoginMessage('Erreur de connexion au serveur');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(getApiUrl('/api/employee/password-reset-request'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResetMessage(data.message);
        setResetEmail('');
      } else {
        setResetMessage(data.error || 'Erreur lors de la demande');
      }
    } catch (error) {
      setResetMessage('Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://mocha-cdn.com/01987424-b707-7509-9ec8-32da1056e699/logo_anpt_02-(1).png" 
            alt="ANPT Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            SirteRH
          </h1>
          <p className="text-gray-600">Connexion au système de gestion RH</p>
        </div>

        {!showPasswordReset && !showLocalLogin ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
              <p className="text-gray-600">Accédez à votre espace personnel ou administrateur</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <p className="text-red-700 text-sm">
                  <strong>Connexion Google OAuth désactivée</strong><br />
                  Pour des raisons de sécurité, seules les connexions avec les identifiants fournis par le DRH sont autorisées.
                </p>
              </div>

              <button
                onClick={() => setShowLocalLogin(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
              >
                <Lock className="w-5 h-5" />
                <span>Se connecter avec login/mot de passe</span>
              </button>

              <button
                onClick={() => setShowPasswordReset(true)}
                className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Mot de passe oublié ?</span>
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">Accès sécurisé :</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Employés :</strong> Utilisez uniquement les identifiants fournis par votre DRH</p>
                <p><strong>Sécurité :</strong> Aucune autre méthode de connexion n'est autorisée</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 py-2 font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        ) : showLocalLogin ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion Employé</h2>
              <p className="text-gray-600">Connectez-vous avec vos identifiants</p>
            </div>

            <form onSubmit={handleLocalLogin} className="space-y-4">
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                  Login
                </label>
                <input
                  type="text"
                  id="login"
                  value={loginForm.login}
                  onChange={(e) => setLoginForm({...loginForm, login: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Votre nom d'utilisateur"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Votre mot de passe"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Se connecter
              </button>

              {loginMessage && (
                <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  {loginMessage}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowLocalLogin(false);
                  setLoginMessage('');
                  setLoginForm({ login: '', password: '' });
                }}
                className="w-full text-gray-500 hover:text-gray-700 py-2 font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour aux options de connexion</span>
              </button>
            </form>

            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-700">
                <strong>Sécurité renforcée :</strong> Seuls les identifiants créés par le DRH sont autorisés.
                Pour toute demande de réinitialisation, utilisez le bouton "Mot de passe oublié" ci-dessous.
              </p>
            </div>
          </div>
        ) : showPasswordReset ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h2>
              <p className="text-gray-600">Demandez une réinitialisation de votre mot de passe</p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="votre.email@anpt.dz"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Envoyer la demande
              </button>

              {resetMessage && (
                <div className={`p-4 rounded-lg ${resetMessage.includes('Erreur') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  {resetMessage}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowPasswordReset(false);
                  setResetMessage('');
                  setResetEmail('');
                }}
                className="w-full text-gray-500 hover:text-gray-700 py-2 font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour aux options de connexion</span>
              </button>
            </form>

            <div className="mt-6 p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-700">
                <strong>Note :</strong> Votre demande sera traitée par un administrateur RH. 
                Vous recevrez votre nouveau mot de passe par email une fois la demande approuvée.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
