import {useTranslation} from 'react-i18next';
import {WifiOff} from 'lucide-react';
import {useSyncStore} from '../../store/syncStore';
export default function OfflineBanner(){
  const{t}=useTranslation();
  const{isOnline}=useSyncStore();
  if(isOnline)return null;
  return(<div className="bg-amber-500 text-white text-center py-1.5 px-4 text-sm font-medium flex items-center justify-center gap-2"><WifiOff size={16}/>{t('app.offline')}</div>);
}
