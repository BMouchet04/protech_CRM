import {actor,respondError,AccessError} from '@/server/auth';
import {entities,rows,save,softDelete} from '@/server/repository';
import type {Entity} from '@/server/repository';
export const dynamic='force-dynamic';
const entity=(name:string):Entity=>{if(!Object.prototype.hasOwnProperty.call(entities,name))throw new AccessError('INVALID','Objet inconnu.');return name as Entity};
export async function GET(_request:Request,context:{params:Promise<{entity:string}>}){try{return Response.json(await rows(await actor(),entity((await context.params).entity)),{headers:{'Cache-Control':'no-store'}})}catch(e){return respondError(e)}}
export async function POST(request:Request,context:{params:Promise<{entity:string}>}){try{const a=await actor();const e=entity((await context.params).entity);const {value,allowDuplicate,refreshRate}=await request.json() as {value?:Record<string,unknown>;allowDuplicate?:boolean;refreshRate?:boolean};if(!value||typeof value!=='object'||!value.id)throw new AccessError('INVALID','Donnée invalide.');return Response.json({value:await save(a,e,value as Parameters<typeof save>[2],!!allowDuplicate,!!refreshRate)})}catch(e){return respondError(e)}}
export async function DELETE(request:Request,context:{params:Promise<{entity:string}>}){try{const a=await actor();const e=entity((await context.params).entity);const id=new URL(request.url).searchParams.get('id');if(!id)throw new AccessError('INVALID','Identifiant requis.');await softDelete(a,e,id);return Response.json({ok:true})}catch(e){return respondError(e)}}
