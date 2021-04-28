import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);

  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {

    sumAmount[product.id] = product.amount;

    return sumAmount;

  }, {} as CartItemsAmount)

  console.log(cartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      // TODO
      api.get("products").then(res => {
        setProducts(res.data);
        // localStorage.setItem('@RocketShoes:cart', JSON.stringify(res.data))
      })
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    console.log("adding prod")
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map(prod => (
        <li key={prod.id}>
          <img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg" alt="Tênis de Caminhada Leve Confortável" />
          <strong>{prod.title}</strong>
          <span>{formatPrice(prod.price)}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(prod.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[prod.id] || 0}
            </div>
            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
