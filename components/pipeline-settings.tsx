'use client';
import {createContext,useContext} from 'react';
import {inactivityDays} from '@/data/pipelines';
import type {PipelineId} from '@/types/crm';
export const PipelineSettings=createContext<Record<PipelineId,number>>(inactivityDays);
export const usePipelineSettings=()=>useContext(PipelineSettings);
