import {actor,respondError,AccessError} from '@/server/auth';
import {candidates} from '@/server/repository';
export async function POST(request:Request){try{const a=await actor();const {entity,value}=await request.json() as {entity?:string;value?:Record<string,unknown>};if(!value||typeof value!=='object')throw new AccessError('INVALID','Donnée invalide.');if(entity!=='accounts'&&entity!=='contacts')throw new AccessError('INVALID','Objet inconnu.');return Response.json({candidates:await candidates(a,entity,value as Parameters<typeof candidates>[2])})}catch(e){return respondError(e)}}
