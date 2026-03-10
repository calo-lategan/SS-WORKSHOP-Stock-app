import {useState} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useLiveQuery} from 'dexie-react-hooks';
import {ArrowLeft,Edit,Minus,Plus} from 'lucide-react';
import {db} from '../../db/database';
import {useStockAdjust} from '../../hooks/useStockAdjust';
import {useAuthStore} from '../../store/authStore';
import PhotoPlaceholder from './PhotoPlaceholder';
import StockAdjuster from './StockAdjuster';

function InfoRow({label,value}:{label:string;value:string}){return <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">{label}</span><span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">{value}</span></div>}

export default function ItemDetail(){
  const{id}=useParams<{id:string}>();
  const{t,i18n}=useTranslation();
  const nav=useNavigate();
  const{role}=useAuthStore();
  const{adjust}=useStockAdjust();
  const[show,setShow]=useState(false);
  const hi=i18n.language==='hi';
  const item=useLiveQuery(()=>id?db.items.get(id):undefined,[id]);
  const history=useLiveQuery(()=>id?db.changeLog.where('itemId').equals(id).reverse().sortBy('createdAt'):[],[id]);
  if(!item)return <div className="p-4 text-center text-gray-400">{t('common.loading')}</div>;
  const name=hi&&item.nameHi?item.nameHi:item.name;
  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button>
        <h2 className="font-semibold text-lg truncate flex-1">{name}</h2>
        {role==='admin'&&<button onClick={()=>nav('/admin/edit/'+id)} className="p-2 rounded-lg hover:bg-gray-100"><Edit size={20} className="text-blue-600"/></button>}
      </div>
      <div className="p-4 space-y-4">
        <PhotoPlaceholder photoThumbnail={item.photoThumbnail} name={item.name} size="lg"/>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
          <button onClick={()=>setShow(true)} className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600"><Minus size={24}/></button>
          <div className="text-center"><div className={`text-4xl font-bold ${item.quantity===0?'text-red-500':'text-gray-800'}`}>{item.quantity}</div><div className="text-sm text-gray-400">{t('inventory.quantity')}</div></div>
          <button onClick={()=>setShow(true)} className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600"><Plus size={24}/></button>
        </div>
        <div className="space-y-3">
          {item.categoryDescription&&<InfoRow label={t('item.category')} value={item.categoryDescription}/>}
          {item.condition&&<InfoRow label={t('item.condition')} value={item.condition}/>}
          {item.remarks&&<InfoRow label={t('item.remarks')} value={item.remarks}/>}
          {item.sku&&<InfoRow label="SKU" value={item.sku}/>}
        </div>
        {history&&history.length>0&&<div>
          <h3 className="font-medium text-gray-700 mb-2">{t('history.title')}</h3>
          <div className="space-y-2">{history.slice(0,10).map(h=><div key={h.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
            <span className={`font-medium ${h.action==='increment'?'text-green-600':h.action==='decrement'?'text-red-600':'text-blue-600'}`}>{h.quantityChange!==undefined?(h.quantityChange>0?'+'+h.quantityChange:h.quantityChange):h.action}</span>
            <span className="text-gray-400">{h.reason}</span>
            <span className="text-gray-400">{new Date(h.createdAt).toLocaleDateString()}</span>
          </div>)}</div>
        </div>}
      </div>
      {show&&<StockAdjuster itemName={name} currentQty={item.quantity} onConfirm={async(d,r)=>{await adjust(item.id,d,r);setShow(false)}} onCancel={()=>setShow(false)}/>}
    </div>
  );
}
