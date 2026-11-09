import React, { useState } from 'react';
import { BannerItem } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { apiRequest } from '../../services/api';
import { useAppDispatch } from '../../app/hooks';
import { addToast } from '../../features/ui/uiSlice';

interface BannersManagerProps {
  banners: BannerItem[];
  onRefresh: () => void;
}

export const BannersManager: React.FC<BannersManagerProps> = ({ banners, onRefresh }) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  const [form, setForm] = useState<{
    title: string;
    subtitle: string;
    tagline: string;
    discountTag: string;
    ctaText: string;
    ctaLink: string;
    imageUrl: string;
    position: 'split_left' | 'split_right' | 'mid_banner' | 'sponsored';
    isEnabled: boolean;
  }>({
    title: 'Big Summer Sale',
    subtitle: 'Up to 70% OFF',
    tagline: "Don't Miss Out On Hot Electronics & Lifestyle!",
    discountTag: 'Up to 70% OFF',
    ctaText: 'Shop the Sale',
    ctaLink: '/shop?sort=discount',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
    position: 'split_left',
    isEnabled: true,
  });

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setForm({
      title: 'Next-Gen Tech',
      subtitle: 'Smarter. Faster. Better.',
      tagline: 'Exclusive discounts on ultrabooks & iPads',
      discountTag: '',
      ctaText: 'Explore Tech',
      ctaLink: '/shop?category=electronics',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
      position: 'split_right',
      isEnabled: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BannerItem) => {
    setEditingBanner(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      tagline: b.tagline || '',
      discountTag: b.discountTag || '',
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      imageUrl: b.imageUrl,
      position: b.position,
      isEnabled: b.isEnabled,
    });
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingBanner) {
      res = await apiRequest(`/cms/banners/${editingBanner.id || editingBanner._id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
    } else {
      res = await apiRequest('/cms/banners', {
        method: 'POST',
        body: JSON.stringify(form),
      });
    }

    if (res.success) {
      setIsModalOpen(false);
      onRefresh();
      dispatch(
        addToast({
          type: 'success',
          title: editingBanner ? 'Banner Updated' : 'Banner Created',
          message: 'Changes are now live on the public storefront.',
        })
      );
    } else {
      dispatch(
        addToast({
          type: 'error',
          title: 'Operation Failed',
          message: res.message || 'Could not save banner.',
        })
      );
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this promotional banner?')) return;
    const res = await apiRequest(`/cms/banners/${id}`, { method: 'DELETE' });
    if (res.success) {
      onRefresh();
      dispatch(
        addToast({
          type: 'info',
          title: 'Banner Removed',
          message: 'Banner removed from website layout.',
        })
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Promotional Banners Management</h2>
            <p className="text-xs text-slate-500">
              Manage split banners, mid-page showcase banners, and sponsored placements on the storefront.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Promotional Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div
            key={b.id || b._id}
            className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between"
          >
            <div className="relative h-36 bg-slate-900 overflow-hidden">
              <img
                src={b.imageUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80'}
                alt={b.title}
                className="w-full h-full object-cover opacity-80"
              />
              <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                {b.position.replace('_', ' ')}
              </span>
              <span
                className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                  b.isEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-slate-200'
                }`}
              >
                {b.isEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{b.title}</h4>
                <p className="text-xs font-black text-blue-600">{b.subtitle}</p>
                {b.tagline && <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{b.tagline}</p>}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{b.ctaLink}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(b.id || (b._id as string))}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Promotional Banner' : 'Create Promotional Banner'}
        subtitle="Manage campaign creatives and destination links."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveBanner} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Big Summer Sale"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Highlight / Discount</label>
              <input
                type="text"
                required
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Up to 70% OFF"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline / Body Text</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Don't Miss Out On Hot Electronics & Lifestyle!"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Position on Homepage</label>
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="split_left">Split Banner Left (Summer Sale position)</option>
                <option value="split_right">Split Banner Right (Next-Gen Tech position)</option>
                <option value="mid_banner">Mid-Page Banner (Live Smarter position)</option>
                <option value="sponsored">Sponsored Placement (Section 10)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CTA Destination URL</label>
              <input
                type="text"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                placeholder="/shop?category=electronics"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
            <input
              type="text"
              required
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isEnabled}
                onChange={(e) => setForm({ ...form, isEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Active and visible on public website</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/30"
              >
                Save Banner
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
