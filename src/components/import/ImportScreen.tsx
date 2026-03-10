import {useState,useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {ArrowLeft,Upload,AlertTriangle,CheckCircle} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {parseERPFile,generateImportPreview,executeImport} from '../../import/erpImport';
import type {ImportMode,ImportPreviewItem,ImportResult} from '../../import/erpImport';
import {useAuthStore} from '../../store/authStore';

function Stat({label,count,color}:{label:string;count:number;color:string}){return <div className={`rounded-lg p-3 text-center ${color}`}><div className="text-2xl font-bold">{count}</div><div className="text-xs">{label}</div></div>}

type Step='upload'|'preview'|'importing'|'done';

export default function ImportScreen(){
  const{t}=useTranslation();const nav=useNavigate();const{storeId}=useAuthStore();
  const[step,setStep]=useState<Step>('upload');const[mode,setMode]=useState<ImportMode>('add_update_only');
  const[preview,setPreview]=useState<ImportPreviewItem[]>([]);const[result,setResult]=useState<ImportResult|null>(null);const[error,setError]=useState('');
  const handleFile=useCallback(async(file:File)=>{
    setError('');const parsed=await parseERPFile(file);
    if(!parsed.valid){setError(parsed.errors.join(', '));return}
    const pd=await generateImportPreview(parsed.rows,mode,storeId);setPreview(pd);setStep('preview');
  },[mode,storeId]);
  const exec=async()=>{setStep('importing');try{const r=await executeImport(preview,mode,storeId);setResult(r);setStep('done')}catch(e:any){setError(e.message);setStep('preview')}};
  const c={new:preview.filter(p=>p.status==='new').length,update:preview.filter(p=>p.status==='update').length,same:preview.filter(p=>p.status==='same').length,removed:preview.filter(p=>p.status==='removed').length};
  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button><h2 className="font-semibold text-lg">{t('import.title')}</h2></div>
      <div className="p-4 space-y-4">
        {error&&<div className="bg-red-50 text-red-700 rounded-lg p-3 flex items-center gap-2 text-sm"><AlertTriangle size={18}/>{error}</div>}
        {step==='upload'&&<>
          <div className="flex gap-2 mb-4">{(['add_update_only','full_sync'] as ImportMode[]).map(m=><button key={m} onClick={()=>setMode(m)} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${mode===m?'border-blue-600 bg-blue-50 text-blue-700':'border-gray-200 text-gray-500'}`}>{t('import.'+(m==='full_sync'?'fullSync':'addUpdate'))}</button>)}</div>
          <div onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f)}} onDragOver={e=>e.preventDefault()} className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <Upload size={40} className="mx-auto text-gray-300 mb-3"/><p className="text-gray-500 mb-3">{t('import.dropzone')}</p>
            <label className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium cursor-pointer hover:bg-blue-700">{t('import.selectFile')}<input type="file" accept=".xlsx,.xls" className="hidden" onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])}/></label>
          </div></>}
        {step==='preview'&&<>
          <div className="grid grid-cols-4 gap-2"><Stat label={t('import.new')} count={c.new} color="bg-green-100 text-green-700"/><Stat label={t('import.update')} count={c.update} color="bg-blue-100 text-blue-700"/><Stat label={t('import.same')} count={c.same} color="bg-gray-100 text-gray-600"/><Stat label={t('import.removed')} count={c.removed} color="bg-red-100 text-red-700"/></div>
          <div className="max-h-[50vh] overflow-auto border rounded-lg"><table className="w-full text-sm"><thead className="bg-gray-50 sticky top-0"><tr><th className="text-left px-3 py-2">Status</th><th className="text-left px-3 py-2">Name</th><th className="text-right px-3 py-2">Qty</th></tr></thead>
            <tbody>{preview.map((p,i)=><tr key={i} className="border-t"><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status==='new'?'bg-green-100 text-green-700':p.status==='update'?'bg-blue-100 text-blue-700':p.status==='removed'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-500'}`}>{p.status}</span></td><td className="px-3 py-2">{p.erpData['Name']||p.existingItem?.name||'—'}</td><td className="px-3 py-2 text-right tabular-nums">{p.erpData['Used']??p.existingItem?.quantity??'—'}</td></tr>)}</tbody></table></div>
          <button onClick={exec} className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700">{t('import.execute')} ({c.new+c.update} changes)</button></>}
        {step==='importing'&&<div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"/><p className="text-gray-500">{t('import.importing')}</p></div>}
        {step==='done'&&result&&<div className="text-center py-8 space-y-4"><CheckCircle size={48} className="mx-auto text-green-500"/><h3 className="text-lg font-semibold text-green-700">{t('import.success')}</h3>
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto"><Stat label={t('import.added')} count={result.added} color="bg-green-100 text-green-700"/><Stat label={t('import.updated')} count={result.updated} color="bg-blue-100 text-blue-700"/><Stat label={t('import.unchanged')} count={result.unchanged} color="bg-gray-100 text-gray-600"/><Stat label={t('import.removed_count')} count={result.removed} color="bg-red-100 text-red-700"/></div>
          <button onClick={()=>nav('/')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700">{t('nav.inventory')}</button></div>}
      </div>
    </div>
  );
}
