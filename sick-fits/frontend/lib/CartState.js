import { createContext, useContext, useState } from 'react';

const Context = createContext();

function CartStateProvider({ children }) {
  // Custom provider to read cart state
  const [cartOpen, setCartOpen] = useState(false);
  const toggleCart = () => setCartOpen(!cartOpen);
  const closeCart = () => setCartOpen(false);
  const openCart = () => setCartOpen(true);

  return (
    <Context.Provider value={{ cartOpen, toggleCart, closeCart, openCart }}>
      {children}
    </Context.Provider>
  );
}

// Custom hook to write the cart state
function useCart() {
  const ctx = useContext(Context);
  return ctx;
}

export { CartStateProvider, useCart };
