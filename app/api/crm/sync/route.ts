import {env} from 'cloudflare:workers';
import {actor,requirePermission,respondError,AccessError} from '@/server/auth';

export const dynamic='force-dynamic';

function syncUrl(){
 const configured=env.SUPABASE_SYNC_URL?.trim();
 return configured||'https://gvpdyxqswvvqyskfuwal.supabase.co/functions/v1/sync-google-sheet';
}
async function callSync(method:'GET'|'POST',body?:Record<string,unknown>){
 const secret=env.SYNC_SHARED_SECRET?.trim();
 if(!secret)throw new AccessError('UNAVAILABLE','La synchronisation des données n’est pas encore configurée.');
 const response=await fetch(syncUrl(),{
  method,
  headers:{'Content-Type':'application/json','x-sync-secret':secret},
  ...(body?{body:JSON.stringify(body)}:{})
 });
 const payload=await response.json().catch(()=>({error:'Réponse de synchronisation invalide.'})) as Record<string,unknown>;
 if(!response.ok){
  const message=String(payload.error||'Synchronisation impossible.');
  if(response.status===409)throw new AccessError('CONFLICT','Une synchronisation est déjà en cours.');
  throw new AccessError('UNAVAILABLE',message);
 }
 return payload;
}
export async function GET(){
 try{
  const a=await actor();
  await requirePermission(a,'data.sync');
  return Response.json(await callSync('GET'),{headers:{'Cache-Control':'no-store'}});
 }catch(e){return respondError(e)}
}
export async function POST(){
 try{
  const a=await actor();
  await requirePermission(a,'data.sync');
  const result=await callSync('POST',{triggerType:'MANUAL',triggeredByUserId:a.id,triggeredByName:a.name});
  return Response.json(result,{headers:{'Cache-Control':'no-store'}});
 }catch(e){return respondError(e)}
}
