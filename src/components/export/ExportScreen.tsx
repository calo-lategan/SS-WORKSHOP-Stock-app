import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ArrowLeft,FileSpreadsheet,Sheet} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {exportToExcel} from '../../export/excelExport';
export default function ExportScreen(){
  const{t}=useTranslation();const nav=useNavigate();const[exporting,setExporting]=useState(false);const[msg,setMsg]=useState('');
  const go=async()=>{setExporting(true);setMsg('');try{await exportToExcel();setMsg(t('export.success'))}catch(e:any){setMsg(t('export.error')+': '+e.message)}setExporting(false)};
  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button><h2 className="font-semibold text-lg">{t('export.title')}</h2></div>
      <div className="p-4 space-y-4">
        <button onClick={go} disabled={exporting} className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><FileSpreadsheet size={24} className="text-green-600"/></div>
          <div className="text-left"><div className="font-medium">{t('export.excel')}</div><div className="text-sm text-gray-400">Works offline</div></div>
        </button>
        <button disabled className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 rounded-xl p-4 opacity-50 cursor-not-allowed">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Sheet size={24} className="text-blue-600"/></div>
          <div className="text-left"><div className="font-medium">{t('export.sheets')}</div><div className="text-sm text-gray-400">Coming soon</div></div>
        </button>
        {msg&&<p className={`text-center text-sm ${msg.includes('!')?'text-green-600':'text-red-500'}`}>{msg}</p>}
      </div>
    </div>
  );
}
