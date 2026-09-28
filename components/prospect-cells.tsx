'use client';
import type {Prospect,Status} from '@/types/prospect';
import {statuses,owners} from '@/data/prospects';
export function StatusCell({value,onChange}:{value:Status;onChange:(v:Status)=>void}) {return <select aria-label="Changer le statut" value={value} onChange={e=>onChange(e.target.value as Status)} className={`status-cell status-${value.replaceAll(' ','-').toLowerCase()}`}><option value={value}>{value}</option>{statuses.filter(s=>s!==value).map(s=><option key={s}>{s}</option>)}</select>}
export function ScoreCell({score}:{score:number}) {return <span className={`score score-${score>=80?'high':score>=60?'good':score>=40?'mid':'low'}`}>{score}</span>}
export function OwnerCell({value,onChange}:{value:string;onChange:(v:string)=>void}) {return <div className="owner-cell"><span className="avatar">{value.split(' ').map(x=>x[0]).join('')}</span><select aria-label="Changer le responsable" value={value} onChange={e=>onChange(e.target.value)}>{owners.map(o=><option key={o}>{o}</option>)}</select></div>}
export function ProspectIdentity({prospect:p}:{prospect:Prospect}) {return <div className="identity"><strong>{p.first} {p.last}</strong><small>{p.position}</small></div>}
