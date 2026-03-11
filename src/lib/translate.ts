const cache=new Map<string,string>();
export async function translateHiToEn(text:string):Promise<string>{
  if(!text.trim())return '';
  const cached=cache.get(text);
  if(cached)return cached;
  try{
    const url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=en&dt=t&q='+encodeURIComponent(text);
    const res=await fetch(url);
    const data=await res.json();
    const result=data?.[0]?.map((s:any)=>s?.[0]).join('')||text;
    cache.set(text,result);
    return result;
  }catch{return text}
}
