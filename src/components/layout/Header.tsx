import {useTranslation} from 'react-i18next';
import {Menu,Package,LogOut,Wifi,WifiOff,RefreshCw} from 'lucide-react';
import {useAuthStore} from '../../store/authStore';
import {useSyncStore} from '../../store/syncStore';

export default function Header({onMenuToggle}:{onMenuToggle:()=>void}){
  const{t}=useTranslation();
  const{role,logout}=useAuthStore();
  const{isOnline,isSyncing,pendingCount}=useSyncStore();
  return(
    <header className="sticky top-0 z-40 bg-blue-600 text-white shadow-md">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="p-2 -ml-2 rounded-lg hover:bg-blue-700 active:bg-blue-800"><Menu size={24}/></button>
          <div className="flex items-center gap-2"><Package size={22}/><span className="font-semibold text-lg hidden sm:inline">{t('app.name')}</span></div>
        </div>
        <div className="flex items-center gap-2">
          {isSyncing&&<RefreshCw size={18} className="animate-spin"/>}
          {pendingCount>0&&<span className="bg-amber-500 text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>}
          {isOnline?<Wifi size={18} className="text-green-300"/>:<WifiOff size={18} className="text-red-300"/>}
          {role&&<span className="text-xs bg-blue-700 px-2 py-1 rounded capitalize">{role}</span>}
          <button onClick={logout} className="p-2 rounded-lg hover:bg-blue-700" title={t('auth.logout')}><LogOut size={18}/></button>
        </div>
      </div>
    </header>
  );
}
