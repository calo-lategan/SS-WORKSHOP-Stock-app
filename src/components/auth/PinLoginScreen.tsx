import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Package} from 'lucide-react';
import PinPad from './PinPad';
import {useAuthStore} from '../../store/authStore';
import {STORE_ID,ROLES} from '../../lib/constants';

const DEMO_PINS:Record<string,{role:'admin'|'worker';label:string}>={'1234':{role:ROLES.ADMIN,label:'Admin'},'0000':{role:ROLES.WORKER,label:'Worker'}};

export default function PinLoginScreen(){
  const{t}=useTranslation();
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);
  const{login}=useAuthStore();
  const handleSubmit=async(pin:string)=>{
    setLoading(true);setError('');
    await new Promise(r=>setTimeout(r,300));
    const m=DEMO_PINS[pin];
    if(m){login(m.role,m.label,STORE_ID)}else{setError(t('auth.error'))}
    setLoading(false);
  };
  return(
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-3"><Package size={32} className="text-blue-600"/></div>
          <h1 className="text-xl font-bold text-gray-800">{t('app.name')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('auth.title')}</p>
        </div>
        <PinPad onSubmit={handleSubmit} error={error} loading={loading}/>
        <p className="text-center text-xs text-gray-400 mt-6">Admin: 1234 | Worker: 0000</p>
      </div>
    </div>
  );
}
