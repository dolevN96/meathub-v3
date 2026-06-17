import { supabase } from './supabase';
import { useQuery } from '@tanstack/react-query';

/**
 * Submit a cart to the checkout_cart RPC.
 *
 * cartItems shape (from App state / CheckoutScreen):
 *   { groupId: string, productId: string, qty: number (kg), priceGroup: number }
 *
 * priceGroup comes from PRODUCTS[].priceGroup — the caller must resolve it
 * before passing to this function (CheckoutScreen already has it via PRODUCTS lookup).
 */
export async function checkout(cartItems) {
  const rpcItems = cartItems.map(item => ({
    group_id: item.groupId,
    product_id: item.productId,
    kg: item.qty,
    price_per_kg: item.priceGroup,
  }));

  const { data, error } = await supabase.rpc('checkout_cart', { cart_items: rpcItems });

  if (error) throw new Error(error.message);

  if (data?.error) {
    const msg = data.error;
    if (msg.startsWith('exceeds_capacity')) {
      const parts = msg.split(':');
      const available = parts[3] || '0';
      throw new Error(`אחת הקבוצות כבר מלאה. נשאר רק ${available} ק"ג`);
    }
    if (msg === 'not_authenticated') throw new Error('יש להתחבר כדי להזמין');
    if (msg === 'group_not_active') throw new Error('אחת הקבוצות כבר לא פעילה');
    throw new Error('אירעה שגיאה בתהליך ההזמנה, נסה שוב');
  }

  return data; // { success: true, order_id, total, pickup_code }
}

/**
 * TanStack Query hook — returns the signed-in user's full order history.
 * Each order includes order_items joined with the product row.
 */
export function useOrders(user) {
  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(name, grade_label))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
