
import React, { useState } from 'react';
import { CrownIcon } from './icons/Icons';
import { supabase } from '../services/supabaseClient';

interface AuthProps {
  onLogin: (userId: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
        if (isLogin) {
            // Supabase Login
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            if (data.user) {
                onLogin(data.user.id);
            }
        } else {
            // Supabase Register
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Save basic profile data on signup if needed, currently we do it on hook load
                }
            });

            if (error) throw error;
            
            if (data.user) {
                 // If email confirmation is enabled in Supabase, user might not be logged in immediately
                 if (data.session) {
                     onLogin(data.user.id);
                 } else {
                     setInfoMessage('Conta criada! Verifique seu email para confirmar o cadastro.');
                     setIsLogin(true); // Switch back to login
                 }
            }
        }
    } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao conectar. Verifique suas credenciais.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0514] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[100px]"></div>

      <div className="bg-[#150a24] border border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(147,51,234,0.25)] relative z-10 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-[#1E1629] border border-purple-500/50 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <CrownIcon className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold font-oxanium text-white mb-2">Comunicação Épica</h1>
          <p className="text-purple-300 text-sm">Sua jornada de oratória começa aqui.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm text-center font-bold animate-pulse">
            {error}
          </div>
        )}
        
        {infoMessage && (
          <div className="mb-6 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-200 text-sm text-center font-bold">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase font-bold text-purple-400 mb-1 tracking-wider">Email de Acesso</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1E1629] border border-purple-500/30 rounded-xl p-3 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-purple-400 mb-1 tracking-wider">Senha Secreta</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1E1629] border border-purple-500/30 rounded-xl p-3 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold font-oxanium text-lg py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
               isLogin ? 'ENTRAR NO PORTAL' : 'CRIAR NOVA CONTA'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Ainda não tem uma conta?' : 'Já possui um registro?'}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 text-pink-400 font-bold hover:text-pink-300 underline decoration-dashed underline-offset-4 transition-colors"
            >
              {isLogin ? 'Cadastre-se' : 'Fazer Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
