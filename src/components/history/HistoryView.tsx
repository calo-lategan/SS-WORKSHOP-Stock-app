import {useTranslation} from 'react-i18next';
import {useLiveQuery} from 'dexie-react-hooks';
import {ArrowLeft} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {db} from '../../db/database';
import {useAuthStore} from '../../store/authStore';
export default function HistoryView(){
  const{t}=useTranslation();const nav=useNavigate();const{storeId}=useAuthStore();
  const logs=useLiveQuery(()=>db.changeLog.where('storeId').equals(storeId).reverse().sortBy('createdAt'),[storeId]);
  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button><h2 className="font-semibold text-lg">{t('history.title')}</h2></div>
      <div className="p-4 space-y-2">
        {!logs||logs.length===0?<p className="text-center text-gray-400 py-12">{t('history.noHistory')}</p>
        :logs.map(l=><div key={l.id} className="bg-white border rounded-lg px-4 py-3 flex items-center justify-between">
          <div><span className={`font-medium text-sm ${l.action==='increment'?'text-green-600':l.action==='decrement'?'text-red-600':'text-blue-600'}`}>{l.quantityChange!==undefined?(l.quantityChange>0?'+'+l.quantityChange:l.quantityChange):l.action}</span><span className="text-sm text-gray-500 ml-2">{l.reason||l.action}</span></div>
          <div className="text-xs text-gray-400"><div>{l.performedBy}</div><div>{new Date(l.createdAt).toLocaleString()}</div></div>
        </div>)}
      </div>
    </div>
  );
}
