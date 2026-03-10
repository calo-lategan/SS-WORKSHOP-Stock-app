import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Minus,Plus,X} from 'lucide-react';
const REASONS=['used','received','damaged','returned','adjustment'];
export default function StockAdjuster({itemName,currentQty,onConfirm,onCancel}:{itemName:string;currentQty:number;onConfirm:(d:number,r:string)=>void;onCancel:()=>void}){
  const{t}=useTranslation();
  const[delta,setDelta]=useState(0);
  const[reason,setReason]=useState(REASONS[0]);
  const nq=Math.max(0,currentQty+delta);
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-lg">{itemName}</h3><button onClick={onCancel} className="p-1 rounded-lg hover:bg-gray-100"><X size={20}/></button></div>
        <div className="flex items-center justify-center gap-6 my-6">
          <button onClick={()=>setDelta(d=>d-1)} disabled={nq<=0} className="w-14 h-14 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 disabled:opacity-30"><Minus size={28}/></button>
          <div className="text-center"><div className="text-4xl font-bold tabular-nums">{nq}</div><div className="text-sm text-gray-400 mt-1">{delta>0?'+'+delta:delta<0?String(delta):'\u00B10'}</div></div>
          <button onClick={()=>setDelta(d=>d+1)} className="w-14 h-14 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600"><Plus size={28}/></button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">{REASONS.map(r=><button key={r} onClick={()=>setReason(r)} className={`px-3 py-1.5 rounded-full text-sm ${r===reason?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>{t('item.'+r)}</button>)}</div>
        <button onClick={()=>onConfirm(delta,reason)} disabled={delta===0} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl disabled:opacity-40 transition-colors">{t('common.confirm')}</button>
      </div>
    </div>
  );
}
