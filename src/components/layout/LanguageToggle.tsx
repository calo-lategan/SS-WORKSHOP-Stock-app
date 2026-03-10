import {useTranslation} from 'react-i18next';
export default function LanguageToggle(){
  const{i18n}=useTranslation();
  const isHi=i18n.language==='hi';
  return(
    <button onClick={()=>i18n.changeLanguage(isHi?'en':'hi')}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 bg-white border-2 border-gray-300 shadow-lg rounded-full px-3 py-2 text-sm font-medium hover:bg-gray-50 active:scale-95 transition-transform"
      aria-label="Toggle language">
      <span className="text-lg">{isHi?'\u{1F1EC}\u{1F1E7}':'\u{1F1EE}\u{1F1F3}'}</span>
      <span>{isHi?'EN':'हिंदी'}</span>
    </button>
  );
}
