'use client';
import {useEffect,useState} from 'react';

type Run={
 id:string;trigger_type:'AUTO'|'MANUAL';triggered_by_name:string|null;status:'RUNNING'|'SUCCESS'|'FAILED';
 started_at:string;finished_at:string|null;rows_read:number;rows_written:number;rows_by_tab:Record<string,number>;error_message:string|null;
};
type Snapshot={
 source:{id:string;name:string;last_successful_sync_at:string|null;last_failed_sync_at:string|null;last_error:string|null;automatic_sync_local_time:string}|null;
 runs:Run[];
};
const fmt=(v:string|null)=>v?new Date(v).toLocaleString('fr-FR'):'—';

export function DataSyncPanel(){
 const [data,setData]=useState<Snapshot|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const load=async()=>{const r=await fetch('/api/crm/sync',{cache:'no-store'}),b=await r.json() as Snapshot&{error?:string};if(!r.ok)throw new Error(b.error||'Chargement impossible.');setData(b)};
 useEffect(()=>{void load().catch(e=>setError(e.message))},[]);
 const sync=async()=>{setBusy(true);setError('');try{const r=await fetch('/api/crm/sync',{method:'POST'}),b=await r.json() as {error?:string};if(!r.ok)throw new Error(b.error||'Synchronisation impossible.');await load()}catch(e){setError((e as Error).message)}finally{setBusy(false)}};
 if(!data)return <div>{error?<div className="crm-save-error">{error}</div>:<p>Chargement de la source de données…</p>}</div>;
 const running=data.runs.find(r=>r.status==='RUNNING');
 return <div className="data-sync-panel">
  {error&&<div className="crm-save-error" role="alert">{error}</div>}
  <div className="admin-new">
   <div>
    <strong>{data.source?.name||'2026 - BASE POUR STAT'}</strong>
    <small>Google Sheets · Base, Doc en cours, Base PS, Tiers MC et Tiers PS</small>
   </div>
   <div><small>Dernière mise à jour réussie</small><strong>{fmt(data.source?.last_successful_sync_at??null)}</strong></div>
   <div><small>Planification</small><strong>Tous les jours à 02:00 · Europe/Paris</strong></div>
   <button className="crm-primary" disabled={busy||!!running} onClick={()=>void sync()}>
    {running?'Synchronisation en cours…':busy?'Démarrage…':'Mettre à jour les données'}
   </button>
  </div>
  {data.source?.last_error&&<div className="crm-save-error">Dernière erreur : {data.source.last_error}</div>}
  <div className="admin-data-scroll">
   <table className="admin-data-table">
    <thead><tr><th>Début</th><th>Type</th><th>Déclenchée par</th><th>Statut</th><th>Lignes</th><th>Détail par onglet</th></tr></thead>
    <tbody>{data.runs.map(r=><tr key={r.id}>
     <td>{fmt(r.started_at)}</td>
     <td><span className="data-badge">{r.trigger_type==='AUTO'?'Automatique':'Manuelle'}</span></td>
     <td>{r.triggered_by_name||'Système'}</td>
     <td><strong>{r.status==='SUCCESS'?'Réussie':r.status==='RUNNING'?'En cours':'Échec'}</strong>{r.error_message&&<small>{r.error_message}</small>}</td>
     <td>{r.rows_read.toLocaleString('fr-FR')}</td>
     <td>{Object.entries(r.rows_by_tab||{}).map(([k,v])=>`${k}: ${Number(v).toLocaleString('fr-FR')}`).join(' · ')||'—'}</td>
    </tr>)}</tbody>
   </table>
  </div>
 </div>
}
