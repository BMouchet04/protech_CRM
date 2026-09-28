import {actor,respondError} from '@/server/auth';
import {snapshot} from '@/server/repository';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await snapshot(await actor()),{headers:{'Cache-Control':'no-store'}})}catch(e){return respondError(e)}}
