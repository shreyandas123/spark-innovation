"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Save, LayoutTemplate, Phone, Share2, Loader2,
  Upload, Trash2, Globe, Info, QrCode, Move, BarChart3, CheckCircle2
} from "lucide-react";
import { fetchSiteSettings, updateSiteSettings, uploadImage } from "@/lib/api";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [gaConnected, setGaConnected] = useState(false);
  const [gaConnecting, setGaConnecting] = useState(false);
  const { token } = useAuth();
  const { showToast } = useToast();
  const { refreshSettings } = useSettings();

  const [settings, setSettings] = useState({
    websiteName: "",
    metaDescription: "",
    phone: "",
    email: "",
    address: "",
    mapsUrl: "",
    logo: "",
    favicon: "",
    topBarText: "",
    upiQrCode: "",
    whatsappNumber: "",
    social: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: ""
    }
  });

  const loadSettings = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await fetchSiteSettings();
      if (data && data.settings) {
        // Ensure we don't overwrite with empty values if some fields are missing
        setSettings(prev => ({
          ...prev,
          ...data.settings,
          social: {
            ...prev.social,
            ...(data.settings.social || {})
          }
        }));
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      showToast("Failed to load settings", "error");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadSettings(false);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      
      showToast(`Uploading ${type}...`, "info");
      const res = await uploadImage(token, formData);
      
      if (res.url) {
        setSettings(prev => ({ ...prev, [type]: res.url }));
        showToast(`${type} uploaded successfully!`, "success");
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      showToast(err.message || `Failed to upload ${type}`, "error");
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await updateSiteSettings(token, settings);
      showToast("Settings saved successfully!", "success");
      refreshSettings();
    } catch (err) {
      console.error("Error saving settings:", err);
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGAAuth = async () => {
    try {
      setGaConnecting(true);
      const response = await fetch("/api/ga-auth/auth-url");

      if (!response.ok) throw new Error("Failed to get auth URL");

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No auth URL returned");
      }
    } catch (err) {
      console.error("GA Auth Error:", err);
      showToast("Failed to connect Google Analytics", "error");
      setGaConnecting(false);
    }
  };

  const tabs = [
    { id: "general", label: "Branding", icon: <LayoutTemplate size={16} /> },
    { id: "contact", label: "Contact Info", icon: <Phone size={16} /> },
    { id: "social", label: "Social Media", icon: <Share2 size={16} /> },
    { id: "qr", label: "UPI / QR Code", icon: <QrCode size={16} /> },
    { id: "ga-analytics", label: "Google Analytics", icon: <BarChart3 size={16} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 bg-white border border-slate-200 rounded-sm">
        <Loader2 className="animate-spin text-brand" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing with server...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-reveal">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900 p-6 md:p-8 rounded-sm border border-white/5">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Globe className="text-brand shrink-0" size={24} />
            <span className="truncate">Command Center <span className="text-brand mx-1">/</span> Site Identity</span>
          </h2>
          <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 leading-relaxed">
            Configure your global presence and brand assets.
          </p>
        </div>
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full lg:w-auto flex items-center justify-center gap-3 bg-brand text-white px-8 py-4 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 disabled:opacity-50 group"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="group-hover:scale-110 transition-transform" />} 
          {isSaving ? "Finalizing..." : "Publish Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 items-start">
        {/* Navigation Sidebar / Slider */}
        <div className="bg-white border border-slate-200 rounded-sm p-1.5 shadow-sm lg:sticky lg:top-6 overflow-x-auto custom-scrollbar no-scrollbar lg:overflow-visible">
          <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 md:px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm transition-all text-left whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-brand text-white shadow-lg shadow-brand/10"
                    : "text-slate-400 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                <span className="shrink-0">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 md:p-10 min-h-150">
            
            {activeTab === "general" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">General Branding</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Website name and core SEO settings.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Website Name (Displayed in Header/Footer)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={settings.websiteName}
                        onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                        placeholder="Spark Innovations"
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold text-brand-blue focus:border-brand outline-none transition-all bg-slate-50/50" 
                      />
                      <Info size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Top Bar Announcement</label>
                    <input 
                      type="text" 
                      value={settings.topBarText}
                      onChange={(e) => setSettings({ ...settings, topBarText: e.target.value })}
                      placeholder="Authorized Kutchina Distributor"
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm focus:border-brand outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">SEO Description</label>
                    <textarea 
                      value={settings.metaDescription}
                      onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                      rows={4} 
                      placeholder="Brief description of your business for search engines..."
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm focus:border-brand outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Brand Logo</label>
                       <div className="relative group">
                         <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 flex flex-col items-center justify-center text-center bg-slate-50 min-h-50 transition-all group-hover:border-brand overflow-hidden">
                           {settings.logo ? (
                             <div className="relative w-full h-full min-h-35 flex items-center justify-center">
                               <Image src={settings.logo} alt="Logo Preview" fill className="object-contain" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button onClick={() => setSettings({ ...settings, logo: "" })} className="p-2 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform">
                                    <Trash2 size={16} />
                                  </button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex flex-col items-center">
                               <Upload size={32} className="text-slate-300 mb-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click button below to upload</span>
                             </div>
                           )}
                         </div>
                         <label className="w-full mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-brand-blue text-white rounded-sm text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-brand transition-all">
                           <Upload size={14} />
                           {settings.logo ? "Replace Brand Logo" : "Upload Brand Logo"}
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} />
                         </label>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Favicon</label>
                       <div className="relative group">
                         <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 flex flex-col items-center justify-center text-center bg-slate-50 min-h-50 transition-all group-hover:border-brand overflow-hidden">
                           {settings.favicon ? (
                             <div className="relative w-20 h-20">
                               <Image src={settings.favicon} alt="Favicon Preview" fill className="object-contain" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button onClick={() => setSettings({ ...settings, favicon: "" })} className="p-2 bg-rose-500 text-white rounded-full">
                                    <Trash2 size={14} />
                                  </button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex flex-col items-center">
                               <Globe size={32} className="text-slate-300 mb-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Browser Tab Icon</span>
                             </div>
                           )}
                         </div>
                         <label className="w-full mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-sm text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-900 transition-all">
                           <Upload size={14} />
                           {settings.favicon ? "Replace Favicon" : "Upload Favicon"}
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "favicon")} />
                         </label>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "contact" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">Contact Information</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Update phone, email and address.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Phone</label>
                      <input 
                        type="text" 
                        value={settings.phone || ""}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Support Email</label>
                      <input 
                        type="email" 
                        value={settings.email || ""}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">WhatsApp Floating Support Number (With Country Code, e.g. 918808409295)</label>
                      <input 
                        type="text" 
                        value={settings.whatsappNumber || ""}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="918808409295"
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Office Address</label>
                    <textarea 
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      rows={3} 
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Google Maps Embed URL</label>
                    <input 
                      type="text" 
                      value={settings.mapsUrl}
                      onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
                      placeholder="https://maps.google.com/..." 
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm focus:border-brand outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">Social Media Presence</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Link your official social accounts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Facebook', 'Instagram', 'Twitter', 'YouTube', 'LinkedIn'].map(social => (
                    <div key={social} className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{social} Profile URL</label>
                      <input
                        type="url"
                        value={settings.social?.[social.toLowerCase()] || ""}
                        onChange={(e) => setSettings({
                          ...settings,
                          social: {
                            ...settings.social,
                            [social.toLowerCase()]: e.target.value
                          }
                        })}
                        placeholder={`https://${social.toLowerCase()}.com/yourname`}
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-xs focus:border-brand outline-none transition-all font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "qr" && (
              <QrCodeTab settings={settings} setSettings={setSettings} token={token} showToast={showToast} />
            )}

            {activeTab === "ga-analytics" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">Google Analytics Integration</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Connect your Google Analytics account to track visitor analytics.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {gaConnected ? (
                        <CheckCircle2 className="text-green-600" size={24} />
                      ) : (
                        <BarChart3 className="text-blue-600" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm text-slate-900 uppercase tracking-widest">
                        {gaConnected ? "✓ Google Analytics Connected" : "Connect Google Analytics"}
                      </h4>
                      <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">
                        {gaConnected
                          ? "Your Google Analytics account is successfully connected. Analytics data will be fetched and displayed on the analytics dashboard."
                          : "Click the button below to authorize and connect your Google Analytics account. This will enable real-time analytics tracking and reporting on your dashboard."
                        }
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleGAAuth}
                    disabled={gaConnecting}
                    className="mt-6 flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {gaConnecting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <BarChart3 size={16} />
                        {gaConnected ? "Reconnect Google Analytics" : "Connect Google Analytics"}
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
                  <h4 className="font-black text-sm text-slate-900 uppercase tracking-widest mb-4">What's Required?</h4>
                  <ul className="space-y-3 text-[10px] text-slate-600 list-disc list-inside">
                    <li>A Google account with access to Google Analytics</li>
                    <li>A Google Analytics property set up for your website</li>
                    <li>Permission to manage Google Analytics on your property</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── QR Code Image Cropper + Upload Tab ─── */
function QrCodeTab({ settings, setSettings, token, showToast }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 200 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0, displayW: 0, displayH: 0 });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    const container = containerRef.current;
    const displayW = container ? container.clientWidth : 400;
    const scale = displayW / natW;
    const displayH = natH * scale;
    setImgDimensions({ w: natW, h: natH, displayW, displayH });
    const initSize = Math.min(displayW, displayH, 280);
    setCrop({ x: (displayW - initSize) / 2, y: (displayH - initSize) / 2, size: initSize });
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const py = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setDragStart({ x: px - crop.x, y: py - crop.y });
  };

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const py = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(px - dragStart.x, imgDimensions.displayW - prev.size)),
      y: Math.max(0, Math.min(py - dragStart.y, imgDimensions.displayH - prev.size)),
    }));
  }, [dragging, dragStart, imgDimensions]);

  const handlePointerUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!rawImage) return;
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [rawImage, handlePointerMove, handlePointerUp]);

  const handleCropAndUpload = async () => {
    if (!imgRef.current) return;
    try {
      setUploading(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const outputSize = 500;
      canvas.width = outputSize;
      canvas.height = outputSize;

      const scaleX = imgDimensions.w / imgDimensions.displayW;
      const scaleY = imgDimensions.h / imgDimensions.displayH;
      const sx = crop.x * scaleX;
      const sy = crop.y * scaleY;
      const sSize = crop.size * scaleX;

      ctx.drawImage(imgRef.current, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);

      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png", 0.95));
      const formData = new FormData();
      formData.append("image", blob, "upi-qr.png");

      showToast("Uploading cropped QR code...", "info");
      const res = await uploadImage(token, formData);
      if (res.url) {
        setSettings(prev => ({ ...prev, upiQrCode: res.url }));
        setRawImage(null);
        showToast("QR code uploaded! Don't forget to Publish Changes.", "success");
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload QR code", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      <canvas ref={canvasRef} className="hidden" />

      <div className="border-b border-slate-100 pb-6">
        <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">UPI / QR Code Setup</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Upload your payment QR code. Customers will scan this during checkout.</p>
      </div>

      {/* Current QR Preview */}
      {settings.upiQrCode && !rawImage && (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 border-4 border-brand/20 rounded-sm overflow-hidden shadow-lg group">
            <Image src={settings.upiQrCode} alt="Current UPI QR" fill className="object-cover" sizes="256px" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => setSettings(prev => ({ ...prev, upiQrCode: "" }))}
                className="p-3 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">QR Code Active</span>
        </div>
      )}

      {/* Upload / Crop Area */}
      {!rawImage ? (
        <div className="flex flex-col items-center">
          <label className="w-full max-w-sm flex items-center justify-center gap-3 px-6 py-4 bg-brand-blue text-white rounded-sm text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-brand transition-all shadow-lg">
            <Upload size={16} />
            {settings.upiQrCode ? "Replace QR Code" : "Upload QR Code Image"}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
          </label>
          <p className="text-[9px] text-slate-400 font-medium mt-3 uppercase tracking-widest text-center">
            Upload any image — you&apos;ll crop it to a square next.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Move size={14} className="text-brand" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Drag the square to position your crop</p>
            </div>

            <div
              ref={containerRef}
              className="relative mx-auto select-none touch-none overflow-hidden bg-slate-200 rounded-sm"
              style={{ maxWidth: 500 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={rawImage}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="w-full h-auto block"
                draggable={false}
              />
              {/* Dark overlay outside crop */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `linear-gradient(to right, rgba(0,0,0,0.55) ${crop.x}px, transparent ${crop.x}px, transparent ${crop.x + crop.size}px, rgba(0,0,0,0.55) ${crop.x + crop.size}px)`,
              }} />
              <div className="absolute pointer-events-none" style={{
                left: crop.x, top: 0, width: crop.size, height: crop.y,
                background: "rgba(0,0,0,0.55)",
              }} />
              <div className="absolute pointer-events-none" style={{
                left: crop.x, top: crop.y + crop.size, width: crop.size, bottom: 0,
                background: "rgba(0,0,0,0.55)",
              }} />
              {/* Crop box */}
              <div
                className="absolute border-2 border-brand cursor-move rounded-sm shadow-xl"
                style={{ left: crop.x, top: crop.y, width: crop.size, height: crop.size }}
                onMouseDown={handlePointerDown}
                onTouchStart={handlePointerDown}
              >
                <div className="absolute inset-0 border border-white/30" />
                {/* Corner indicators */}
                {[
                  "top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"
                ].map(pos => (
                  <div key={pos} className={`absolute ${pos} w-3 h-3 border-2 border-brand bg-white rounded-sm`} />
                ))}
              </div>
            </div>

            {/* Size slider */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">Crop Size</span>
              <input
                type="range"
                min={100}
                max={Math.min(imgDimensions.displayW || 400, imgDimensions.displayH || 400)}
                value={crop.size}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setCrop(prev => ({
                    size: newSize,
                    x: Math.min(prev.x, (imgDimensions.displayW || 400) - newSize),
                    y: Math.min(prev.y, (imgDimensions.displayH || 400) - newSize),
                  }));
                }}
                className="flex-1 accent-brand"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCropAndUpload}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-3 bg-brand text-white px-6 py-4 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-brand-dark transition-all shadow-lg disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={16} /> : <QrCode size={16} />}
              {uploading ? "Uploading..." : "Crop & Upload QR"}
            </button>
            <button
              onClick={() => setRawImage(null)}
              className="px-6 py-4 border-2 border-slate-200 rounded-sm font-black uppercase tracking-widest text-[10px] text-slate-400 hover:border-rose-300 hover:text-rose-500 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
