import {useTranslation} from 'react-i18next';
import {useNavigate,useLocation} from 'react-router-dom';
import {LayoutGrid,PlusCircle,Upload,Download,History,X} from 'lucide-react';
import {useAuthStore} from '../../store/authStore';

const NAV=[
  {key:'inventory',path:'/',icon:LayoutGrid},
  {key:'addItem',path:'/admin/add',icon:PlusCircle,adminOnly:true},
  {key:'import',path:'/import',icon:Upload,adminOnly:true},
  {key:'export',path:'/export',icon:Download},
  {key:'history',path:'/history',icon:History},
];

export default function NavigationDrawer({isOpen,onClose}:{isOpen:boolean;onClose:()=>void}){
  const{t}=useTranslation();
  const nav=useNavigate();
  const loc=useLocation();
  const{role}=useAuthStore();
  const go=(path:string)=>{nav(path);onClose()};
  return(<>
    {isOpen&&<div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}/>}
    <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-200 ${isOpen?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-semibold text-lg text-gray-800">{t('app.name')}</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={20}/></button>
      </div>
      <nav className="py-2">
        {NAV.filter(n=>!n.adminOnly||role==='admin').map(item=>{
          const Icon=item.icon;const active=loc.pathname===item.path;
          return(<button key={item.key} onClick={()=>go(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 ${active?'bg-blue-50 text-blue-600 font-medium':'text-gray-700'}`}>
            <Icon size={20}/>{t('nav.'+item.key)}
          </button>);
        })}
      </nav>
    </div>
  </>);
}
