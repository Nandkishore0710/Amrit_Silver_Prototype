import { mockProducts as initialMockProducts } from '../mockData';
const uuidv4 = () => Math.random().toString(36).substr(2, 9);

const DB_KEYS = {
  PRODUCTS: 'sk_mock_products',
  USERS: 'sk_mock_users',
  ORDERS: 'sk_mock_orders'
};

// Initialize if empty
if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
  localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(initialMockProducts));
}
if (!localStorage.getItem(DB_KEYS.USERS)) {
  const initialUsers = [
    { _id: 'u1', name: 'Admin User', email: 'admin@silverine.in', role: 'admin', createdAt: new Date().toISOString() },
    { _id: 'u2', name: 'Test Customer', email: 'customer@example.com', role: 'user', createdAt: new Date().toISOString() }
  ];
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(initialUsers));
}
if (!localStorage.getItem(DB_KEYS.ORDERS)) {
  const initialOrders = [
    { 
      _id: 'o1', 
      orderNumber: 'ORD-1001', 
      user: { name: 'Test Customer' }, 
      createdAt: new Date().toISOString(), 
      finalAmount: 7722, 
      status: 'Processing' 
    }
  ];
  localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(initialOrders));
}

const mockDb = {
  // PRODUCTS
  getProducts: () => JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS)),
  getProduct: (idOrSlug) => mockDb.getProducts().find(p => p._id === idOrSlug || p.slug === idOrSlug),
  saveProduct: (product) => {
    const products = mockDb.getProducts();
    if (product._id) {
      const idx = products.findIndex(p => p._id === product._id);
      if (idx !== -1) products[idx] = product;
      else products.push(product);
    } else {
      product._id = uuidv4();
      product.slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      products.push(product);
    }
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  },
  deleteProduct: (id) => {
    const products = mockDb.getProducts().filter(p => p._id !== id);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // USERS
  getUsers: () => JSON.parse(localStorage.getItem(DB_KEYS.USERS)),
  saveUser: (user) => {
    const users = mockDb.getUsers();
    if (user._id) {
      const idx = users.findIndex(u => u._id === user._id);
      if (idx !== -1) users[idx] = user;
      else users.push(user);
    } else {
      user._id = uuidv4();
      user.createdAt = new Date().toISOString();
      users.push(user);
    }
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return user;
  },
  deleteUser: (id) => {
    const users = mockDb.getUsers().filter(u => u._id !== id);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  },

  // ORDERS
  getOrders: () => JSON.parse(localStorage.getItem(DB_KEYS.ORDERS)),
  saveOrder: (order) => {
    const orders = mockDb.getOrders();
    if (order._id) {
      const idx = orders.findIndex(o => o._id === order._id);
      if (idx !== -1) orders[idx] = order;
      else orders.push(order);
    } else {
      order._id = uuidv4();
      order.orderNumber = `ORD-${1000 + orders.length + 1}`;
      order.createdAt = new Date().toISOString();
      orders.push(order);
    }
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    return order;
  },

  // STATS
  getStats: () => {
    const products = mockDb.getProducts();
    const orders = mockDb.getOrders();
    const users = mockDb.getUsers();
    const revenue = orders.reduce((sum, o) => sum + o.finalAmount, 0);

    return {
      revenue: { total: revenue, today: 0, growth: 5 },
      orders: { total: orders.length, pending: orders.filter(o => o.status === 'Processing').length, growth: 12 },
      users: { total: users.length, today: 1, growth: 8 },
      products: { total: products.length, outOfStock: products.filter(p => p.stock === 0).length }
    };
  }
};

export default mockDb;
