import {actor,respondError} from '@/server/auth';
import {adminSnapshot,adminMutation} from '@/server/admin';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await adminSnapshot(await actor()),{headers:{'Cache-Control':'no-store'}})}catch(e){return respondError(e)}}
export async function POST(request:Request){try{return Response.json(await adminMutation(await actor(),await request.json()))}catch(e){return respondError(e)}}
