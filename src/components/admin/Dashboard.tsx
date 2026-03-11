import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {useLiveQuery} from 'dexie-react-hooks';
import {ArrowLeft,AlertTriangle,Clock,Sparkles,Package} from 'lucide-react';
import {db} from '../../db/database';
import {useAuthStore} from '../../store/authStore';

type Tab='old'|'maintenance'|'new';

export default function Dashboard(){
  const{t}=useTranslation();
  const nav=useNavigate();
  const{storeId}=useAuthStore();
  const[tab,setTab]=useState<Tab>('old');

  const allItems=useLiveQuery(()=>db.items.where('storeId').equals(storeId).filter(i=>!i.deletedAt).toArray(),[storeId]);

  if(!allItems)return <div className="p-4 text-center text-gray-400">{t('common.loading')}</div>;

  const now=Date.now();
  const DAY=86400000;
  const maintenance=allItems.filter(i=>{
    const cond=(i.condition||'').toLowerCase()+(i.remarks||'').toLowerCase();
    return i.quantity===0||cond.includes('broken')||cond.includes('damaged')||cond.includes('repair')||cond.includes('maintenance')||cond.includes('bad');
  });
  const newItems=allItems.filter(i=>now-new Date(i.createdAt).getTime()<7*DAY);
  const oldItems=allItems.filter(i=>now-new Date(i.updatedAt).getTime()>30*DAY);

  const tabs:{key:Tab;icon:any;label:string;count:number;color:string}[]=[
    {key:'old',icon:Clock,label:t('dashboard.old'),count:oldItems.length,color:'text-gray-600'},
    {key:'maintenance',icon:AlertTriangle,label:t('dashboard.maintenance'),count:maintenance.length,color:'text-amber-600'},
    {key:'new',icon:Sparkles,label:t('dashboard.new'),count:newItems.length,color:'text-green-600'},
  ];
  const list=tab==='old'?oldItems:tab==='maintenance'?maintenance:newItems;

  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button>
        <h2 className="font-semibold text-lg">{t('dashboard.title')}</h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map(tb=>{const I=tb.icon;return(
            <button key={tb.key} onClick={()=>setTab(tb.key)} className={`rounded-xl p-3 text-center border-2 transition-colors ${tab===tb.key?'border-blue-600 bg-blue-50':'border-gray-200'}`}>
              <I size={20} className={`mx-auto mb-1 ${tb.color}`}/>
              <div className="text-2xl font-bold">{tb.count}</div>
              <div className="text-xs text-gray-500">{tb.label}</div>
            </button>
          )})}
        </div>
        <div className="space-y-2">
          {list.length===0?<p className="text-center text-gray-400 py-8">{t('inventory.noItems')}</p>
          :list.map(item=>(
            <div key={item.id} onClick={()=>nav('/item/'+item.id)} className="bg-white border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Package size={20} className="text-gray-400"/></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.shortName||item.name}</div>
                <div className="text-xs text-gray-400">{item.categoryDescription||'—'}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${item.quantity===0?'text-red-500':'text-gray-700'}`}>{item.quantity}</div>
                <div className="text-xs text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
