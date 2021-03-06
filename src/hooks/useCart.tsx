
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {

    try {

      const isProductIsIntheCart = cart.find(p => p.id == productId);

      if (!isProductIsIntheCart) {
        const { data: product } = await api.get(`/products/${productId}`);
        const { data: stock } = await api.get(`/stock/${productId}`);
        setCart([...cart, { ...product, amount: Number(1) }])
      } else {
        console.log("update")
        const updatedCart = cart.map(prod => prod.id == productId ?
          { ...prod, amount: prod.amount + 1 } : prod)
        setCart(updatedCart)
      }

    } catch {
      toast.error("Erro ao adicionar produto, tente de novo.")
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const updatedCart = cart.filter(prod => prod.id != productId);
      setCart(updatedCart);

    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const updatedCart = cart.map(prod => prod.id == productId ?
        { ...prod, amount: prod.amount + amount } : prod)
      setCart(updatedCart);

    } catch {
      toast.error("Erro ao adicionar produto, tente de novo.")
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);
  return context;
}
