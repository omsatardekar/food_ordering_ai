import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Leaf, 
  Flame, 
  Eye, 
  EyeOff,
  UtensilsCrossed,
  ChefHat,
  Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const FALLBACK_IMAGES = {
  Starters: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format',
  'Main Course': 'https://images.unsplash.com/photo-1603894584114-603175ef071e?w=500&auto=format',
  Breads: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500&auto=format',
  Rice: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format',
  Desserts: 'https://images.unsplash.com/photo-1589119908995-c6837939443b?w=500&auto=format',
  Beverages: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format',
  default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format',
};

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Main Course', price: '',
    is_vegetarian: true, is_spicy: false, availability: true, image_url: ''
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null });

  const categories = ['All', 'Veg Starters', 'Non-Veg Starters', 'Veg Main Course', 'Non-Veg Main Course', 'Rice', 'Breads', 'Desserts', 'Beverages'];

  const fetchItems = async () => {
    try {
      const response = await axios.get(`/menu?category=${activeCategory === 'All' ? '' : activeCategory}`);
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [activeCategory]);
  useEffect(() => { return () => { document.body.style.overflow = 'unset'; }; }, [showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`/menu/${editingItem.id}`, formData);
        toast.success('Food item updated');
      } else {
        await axios.post('/menu', formData);
        toast.success('Food item added to menu');
      }
      setShowForm(false); setEditingItem(null); resetForm(); fetchItems();
    } catch (error) { toast.error('Something went wrong'); }
  };

  const handleDelete = async () => {
    const { itemId } = deleteModal;
    try { 
      await axios.delete(`/menu/${itemId}`); 
      toast.success('Item deleted'); 
      fetchItems(); 
    } catch (error) { 
      toast.error('Failed to delete'); 
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axios.patch(`/menu/${id}/availability?availability=${!currentStatus}`);
      toast.success(currentStatus ? 'Marked as Unavailable' : 'Marked as Available');
      fetchItems();
    } catch (error) { toast.error('Could not update status'); }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: 'Main Course', price: '', is_vegetarian: true, is_spicy: false, availability: true, image_url: '' });
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description, category: item.category, price: item.price, is_vegetarian: item.is_vegetarian, is_spicy: item.is_spicy, availability: item.availability, image_url: item.image_url || '' });
    setShowForm(true);
  };

  const getImageSrc = (item) => item.image_url || FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.default;
  const filteredItems = Array.isArray(items) ? items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];
  const availableCount = Array.isArray(items) ? items.filter(i => i.availability).length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-1/3 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-500/20 rounded-full">
                <ChefHat size={14} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold tracking-wide">Menu Management</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Food Menu<span className="text-amber-400">.</span></h1>
            <p className="text-slate-400 mt-2 font-light">Add, edit, or remove dishes from your restaurant menu.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{Array.isArray(items) ? items.length : 0}</p>
                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Total</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-white font-bold text-lg">{availableCount}</p>
                <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Available</p>
              </div>
            </div>
            <button 
              onClick={() => { resetForm(); setEditingItem(null); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all text-sm"
            >
              <Plus size={16} /> Add Dish
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              activeCategory === cat 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search dishes..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl focus:border-slate-300 focus:outline-none transition-all text-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center">
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
              Loading menu...
            </div>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-slate-50">
                <img 
                  src={getImageSrc(item)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.default; }}
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {item.is_vegetarian && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/90 text-white rounded-md text-[10px] font-bold backdrop-blur-sm">
                      <Leaf size={10} /> Veg
                    </div>
                  )}
                  {item.is_spicy && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-rose-500/90 text-white rounded-md text-[10px] font-bold backdrop-blur-sm">
                      <Flame size={10} /> Spicy
                    </div>
                  )}
                </div>
                {/* Price Tag */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm">
                  <span className="font-bold text-slate-900">₹{item.price}</span>
                </div>
                {/* Unavailable overlay */}
                {!item.availability && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg">Unavailable</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{item.name}</h3>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-4">{item.category}</div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(item)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => setDeleteModal({ isOpen: true, itemId: item.id })} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <button 
                    onClick={() => toggleAvailability(item.id, item.availability)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      item.availability 
                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                        : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {item.availability ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Show</>}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <Package size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-medium">No dishes found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{editingItem ? 'Edit Dish' : 'Add New Dish'}</h2>
                  <p className="text-xs text-slate-400">Fill in the details below</p>
                </div>
              </div>
              <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dish Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-sm font-medium" placeholder="e.g. Paneer Butter Masala" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                    <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-sm font-medium h-28 resize-none" placeholder="Describe the dish..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-300 transition-all text-sm font-medium" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price (₹)</label>
                      <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-sm font-bold" placeholder="280" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image URL</label>
                    <input type="url" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-sm font-medium" placeholder="https://..." value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                  </div>
                  <div className="flex gap-8">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-200 text-emerald-500 focus:ring-0" checked={formData.is_vegetarian} onChange={(e) => setFormData({...formData, is_vegetarian: e.target.checked})} />
                      <span className="text-sm font-semibold text-slate-700">Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-200 text-rose-500 focus:ring-0" checked={formData.is_spicy} onChange={(e) => setFormData({...formData, is_spicy: e.target.checked})} />
                      <span className="text-sm font-semibold text-slate-700">Spicy</span>
                    </label>
                  </div>
                </div>

                <div className="col-span-2 pt-3">
                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg text-sm flex items-center justify-center gap-2">
                    {editingItem ? <><Edit2 size={16} /> Save Changes</> : <><Plus size={16} /> Add to Menu</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null })}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to remove this item from the menu? This action cannot be undone."
        confirmText="Delete Item"
      />
    </div>
  );
};

export default MenuManagement;
