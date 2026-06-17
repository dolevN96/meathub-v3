import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from './supabase';

export function useImporters() {
  return useQuery({
    queryKey: ['importers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('importers').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let q = supabase.from('products').select('*, importer:importers(*)');
      if (filters.category && filters.category !== 'הכל') q = q.eq('category', filters.category);
      const { data, error } = await q.order('name');
      if (error) throw error;
      return data;
    },
  });
}

// useGroups — fetch all active delivery events with branch info
export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*, branch:branches(*)')
        .eq('status', 'active')
        .order('ends_at');
      if (error) throw error;
      return data;
    },
  });
}

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('city');
      if (error) throw error;
      return data;
    },
  });
}

// useGroup — single event with branch
export function useGroup(id) {
  return useQuery({
    queryKey: ['group', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*, branch:branches(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// useGroupProducts — all cuts for an event (with realtime)
export function useGroupProducts(groupId) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['group-products', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_products')
        .select('*, product:products(*, importer:importers(*))')
        .eq('group_id', groupId)
        .order('filled_kg', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  useEffect(() => {
    if (!groupId) return;
    const channel = supabase
      .channel(`gp-${groupId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'group_products',
        filter: `group_id=eq.${groupId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['group-products', groupId] });
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [groupId, queryClient]);

  return query;
}
