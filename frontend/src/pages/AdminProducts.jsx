import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import mockDb from '../utils/mockDb';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CATEGORIES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, categoryFilter, page],
    queryFn: async () => {
      let products = mockDb.getProducts();
      if (search) products = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
      if (categoryFilter) products = products.filter(p => p.category === categoryFilter);
      return { data: products, pagination: { pages: 1 } };
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug) => {
      const p = mockDb.getProduct(slug);
      if(p) mockDb.deleteProduct(p._id);
    },
    onSuccess: () => {
      toast.success('Product deleted');
      setDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: () => toast.error('Failed to delete product')
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const productPayload = {
        title: data.name,
        category: data.category,
        description: data.description,
        price: Number(data.price),
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        featured: data.featured,
        images: data.imageUrl ? [{ url: data.imageUrl, isPrimary: true }] : editProduct?.images || []
      };

      if (editProduct) {
        mockDb.saveProduct({ ...editProduct, ...productPayload });
        toast.success('Product updated!');
      } else {
        mockDb.saveProduct({ ...productPayload, stock: 10, rating: 5, numReviews: 0 });
        toast.success('Product created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      setModalOpen(false);
      setEditProduct(null);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
    setTimeout(() => {
      reset({
        name: product.title || product.name,
        category: product.category,
        price: product.price,
        salePrice: product.salePrice || '',
        description: product.description,
        featured: product.featured || false,
        imageUrl: product.images?.[0]?.url || (typeof product.images?.[0] === 'string' ? product.images[0] : '')
      });
    }, 0);
  };

  const openCreate = () => {
    setEditProduct(null);
    setModalOpen(true);
    setTimeout(() => reset({}), 0);
  };

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <Helmet><title>Products — Admin | Silverkaari</title></Helmet>

      <div className="flex h-screen bg-dark-900">
        {/* Sidebar stub */}
        <aside className="w-60 bg-dark-950 border-r border-white/[0.04] flex flex-col p-4">
          <div className="mb-6">
            <p className="text-white font-semibold text-sm">Silverkaari Admin</p>
          </div>
          {[
            { to: '/admin', label: '📊 Dashboard' },
            { to: '/admin/products', label: '🛍️ Products', active: true },
            { to: '/admin/orders', label: '📦 Orders' },
            { to: '/admin/users', label: '👥 Users' }
          ].map(item => (
            <a key={item.to} href={item.to}
              className={clsx('flex items-center px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors',
                item.active ? 'bg-gold-600/20 text-gold-400' : 'text-silver-500 hover:text-white hover:bg-white/5')}>
              {item.label}
            </a>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl text-white">Products</h1>
            <button onClick={openCreate} className="btn-primary">
              <FiPlus size={18} /> Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1 max-w-xs">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-600" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..." className="input pl-10 text-sm" />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="input text-sm max-w-[180px]">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {/* Table */}
          {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Created', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-silver-600 text-xs uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images?.[0]?.url} alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-dark-700 shrink-0" />
                          <div>
                            <p className="text-white text-sm font-medium truncate max-w-[160px]">{product.title || product.name}</p>
                            <p className="text-silver-700 text-xs">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-silver-400 text-sm">{product.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-gold-400 font-semibold text-sm">{formatCurrency(product.salePrice || product.price)}</span>
                          {product.salePrice && product.salePrice < product.price && (
                            <span className="text-silver-600 text-xs line-through">{formatCurrency(product.price)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx('text-sm font-medium',
                          product.totalStock === 0 ? 'text-red-400' :
                          product.totalStock <= 5 ? 'text-amber-400' : 'text-green-400')}>
                          {product.stock ?? product.totalStock ?? product.variants?.reduce((s, v) => s + v.stock, 0) ?? '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.featured && <span className="badge-gold text-[10px] px-1.5">Featured</span>}
                          {product.bestSeller && <span className="badge bg-orange-900/30 text-orange-400 border border-orange-700/20 text-[10px] px-1.5">Best Seller</span>}
                          {product.newArrival && <span className="badge-success text-[10px] px-1.5">New</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-silver-600 text-sm">{formatDate(product.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(product)}
                            className="p-1.5 text-silver-500 hover:text-gold-400 transition-colors">
                            <FiEdit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteConfirm(product)}
                            className="p-1.5 text-silver-500 hover:text-red-400 transition-colors">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-silver-600">No products found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination?.pages > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={clsx('w-9 h-9 rounded-lg text-sm', p === page ? 'bg-gold-600 text-white' : 'border border-white/10 text-silver-400 hover:border-gold-600/50')}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setModalOpen(false); } }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg card p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-2xl text-white">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => { setModalOpen(false); setEditProduct(null); }}
                  className="btn-ghost p-2"><FiX size={20} /></button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-silver-400 mb-1.5">Product Name *</label>
                  <input {...register('name', { required: 'Required' })} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-silver-400 mb-1.5">Category *</label>
                  <select {...register('category', { required: 'Required' })} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500">
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-silver-400 mb-1.5">Main Image URL</label>
                  <input {...register('imageUrl')} placeholder="https://example.com/image.jpg" className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-silver-400 mb-1.5">Original Price (₹) *</label>
                    <input type="number" {...register('price', { required: 'Required', min: { value: 0, message: 'Must be positive' } })}
                      className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500" min={0} step={1} />
                    {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-silver-400 mb-1.5">Sale Price (₹)</label>
                    <input type="number" {...register('salePrice', { min: { value: 0, message: 'Must be positive' } })}
                      className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500" min={0} step={1} placeholder="Optional" />
                    {errors.salePrice && <p className="text-red-400 text-xs mt-1">{errors.salePrice.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-silver-400 mb-1.5">Description *</label>
                  <textarea {...register('description', { required: 'Required', minLength: { value: 20, message: 'Min 20 characters' } })}
                    rows={4} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500 resize-none" />
                  {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 rounded bg-dark-800 border-white/10 text-gold-500 focus:ring-gold-500/50" />
                  <label htmlFor="featured" className="text-sm font-medium text-white cursor-pointer">
                    Featured (Show on Home Page)
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center py-2.5">
                    {isSubmitting ? 'Saving...' : editProduct ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setModalOpen(false); setEditProduct(null); }}
                    className="btn-secondary flex-1 justify-center py-2.5">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="w-full max-w-sm card p-6 text-center space-y-4">
              <div className="text-4xl">⚠️</div>
              <h3 className="font-serif text-xl text-white">Delete Product?</h3>
              <p className="text-silver-500 text-sm">This will permanently delete <strong className="text-white">{deleteConfirm.name}</strong>. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={() => deleteMutation.mutate(deleteConfirm.slug)} disabled={deleteMutation.isPending}
                  className="btn-danger flex-1 justify-center">
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminProducts;
