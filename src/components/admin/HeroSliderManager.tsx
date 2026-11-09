import React, { useState } from 'react';
import { HeroSlide } from '../../types';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Check,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { apiRequest } from '../../services/api';
import { useAppDispatch } from '../../app/hooks';
import { addToast } from '../../features/ui/uiSlice';

interface HeroSliderManagerProps {
  slides: HeroSlide[];
  onRefresh: () => void;
}

export const HeroSliderManager: React.FC<HeroSliderManagerProps> = ({ slides, onRefresh }) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [form, setForm] = useState({
    title: 'Upgrade Your Life with',
    highlight: 'Aurelia',
    subtitle: 'Premium Quality. Unbeatable Prices. Fast delivery across Bangladesh.',
    badge: 'Limited Time Offer ⚡',
    discountBadge: 'Up to 50% OFF',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
    desktopImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
    order: 1,
    isEnabled: true,
  });

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setForm({
      title: 'Upgrade Your Life with',
      highlight: 'Aurelia',
      subtitle: 'Premium Quality. Unbeatable Prices. Fast delivery across Bangladesh.',
      badge: 'Limited Time Offer ⚡',
      discountBadge: 'Up to 50% OFF',
      ctaText: 'Shop Now',
      ctaLink: '/shop',
      desktopImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
      order: slides.length + 1,
      isEnabled: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setForm({
      title: slide.title,
      highlight: slide.highlight,
      subtitle: slide.subtitle,
      badge: slide.badge,
      discountBadge: slide.discountBadge,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      desktopImage: slide.desktopImage,
      order: slide.order,
      isEnabled: slide.isEnabled,
    });
    setIsModalOpen(true);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingSlide) {
      res = await apiRequest(`/cms/slides/${editingSlide.id || editingSlide._id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
    } else {
      res = await apiRequest('/cms/slides', {
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
          title: editingSlide ? 'Slide Updated' : 'Slide Created',
          message: 'Changes are now live on the public storefront hero carousel.',
        })
      );
    } else {
      dispatch(
        addToast({
          type: 'error',
          title: 'Operation Failed',
          message: res.message || 'Could not save slide.',
        })
      );
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this hero slide?')) return;
    const res = await apiRequest(`/cms/slides/${id}`, { method: 'DELETE' });
    if (res.success) {
      onRefresh();
      dispatch(
        addToast({
          type: 'info',
          title: 'Slide Deleted',
          message: 'Slide removed from hero carousel.',
        })
      );
    }
  };

  const handleToggleEnable = async (slide: HeroSlide) => {
    const res = await apiRequest(`/cms/slides/${slide.id || slide._id}`, {
      method: 'PUT',
      body: JSON.stringify({ isEnabled: !slide.isEnabled }),
    });
    if (res.success) {
      onRefresh();
      dispatch(
        addToast({
          type: 'success',
          title: 'Visibility Toggled',
          message: `Slide is now ${!slide.isEnabled ? 'visible' : 'hidden'} on the homepage.`,
        })
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Homepage Hero Slider Management</h2>
            <p className="text-xs text-slate-500">
              Control the main hero banner headlines, promotional badges, CTA links, and showcase imagery.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {/* Slide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map((slide) => (
          <div
            key={slide.id || slide._id}
            className={`rounded-2xl border p-5 space-y-3 transition-all relative overflow-hidden ${
              slide.isEnabled
                ? 'bg-gradient-to-r from-[#001736] via-[#002f6c] to-[#001e4a] text-white border-blue-900 shadow-md'
                : 'bg-slate-50 border-slate-200 text-slate-600 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {slide.badge || 'Offer'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleEnable(slide)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={slide.isEnabled ? 'Hide from public' : 'Show on homepage'}
                >
                  {slide.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleOpenEdit(slide)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Edit slide"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteSlide(slide.id || (slide._id as string))}
                  className="p-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 transition-colors"
                  title="Delete slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black leading-tight">
                {slide.title} <span className="text-cyan-300">{slide.highlight}</span>
              </h3>
              <p className="text-xs text-blue-100/80 line-clamp-2">{slide.subtitle}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="font-bold text-amber-300">{slide.discountBadge}</span>
              <span className="text-[11px] text-blue-200">
                Button: <strong className="text-white">{slide.ctaText}</strong> ({slide.ctaLink})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating / Editing Slide */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
        subtitle="Changes immediately update the live public storefront carousel."
        maxWidth="xl"
      >
        <form onSubmit={handleSaveSlide} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tagline</label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="Limited Time Offer ⚡"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Tag</label>
              <input
                type="text"
                value={form.discountBadge}
                onChange={(e) => setForm({ ...form, discountBadge: e.target.value })}
                placeholder="Up to 50% OFF"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headline Prefix</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Upgrade Your Life with"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Highlighted Brand / Word</label>
              <input
                type="text"
                required
                value={form.highlight}
                onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                placeholder="Aurelia"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-cyan-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle Description</label>
            <textarea
              rows={2}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Premium Quality. Unbeatable Prices. Fast delivery across Bangladesh."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                placeholder="Shop Now"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CTA Destination URL</label>
              <input
                type="text"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                placeholder="/shop"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Image URL</label>
            <input
              type="text"
              value={form.desktopImage}
              onChange={(e) => setForm({ ...form, desktopImage: e.target.value })}
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
              <span>Enabled & Active on Homepage</span>
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
                Save Slide
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
