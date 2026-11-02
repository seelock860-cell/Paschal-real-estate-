import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, User, Plus, Edit, Trash2, CheckCircle2, AlertCircle, 
  Database, RefreshCw, Key, ExternalLink, Copy, Check, Eye, EyeOff,
  LogOut, Phone, Mail, Calendar, MessageSquare, Image, Upload, Loader2, Sparkles
} from 'lucide-react';
import { Property, Enquiry, SupabaseConfig, AvailabilityStatus, PropertyCategory, FurnishingStatus } from '../types/property';
import { api } from '../services/api';
import { testSupabaseConnection, SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { formatNaira, getWhatsAppUrl } from '../utils/format';
import { CATEGORIES, NEIGHBORHOODS, AMENITIES_LIST } from '../data/initialProperties';

interface AdminDashboardProps {
  properties: Property[];
  onRefreshProperties: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  onRefreshProperties,
}) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'properties' | 'enquiries' | 'supabase' | 'security'>('properties');

  // Properties management
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Enquiries
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);

  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState('https://tgkgfbllswzvmnefkxiu.supabase.co');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna2dmYmxsc3d6dm1uZWZreGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MjI2NTQsImV4cCI6MjEwOTE5ODY1NH0.k8nmzUnL82cZ_i61Zvb3-K1fn0ccTQFNvoNuRkyolF8');
  const [bucketName, setBucketName] = useState('property-images');
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ success: boolean; message: string; tableReady?: boolean } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Password change
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Initial check on mount
  useEffect(() => {
    checkCurrentAuth();
  }, []);

  const checkCurrentAuth = async () => {
    const admin = await api.checkAuth();
    if (admin) {
      setIsLoggedIn(true);
      loadDashboardData();
    }
  };

  const loadDashboardData = async () => {
    try {
      setEnquiriesLoading(true);
      const enqList = await api.getEnquiries();
      setEnquiries(enqList);

      const cfg = await api.getSupabaseConfig();
      if (cfg) {
        setSupabaseUrl(cfg.supabaseUrl || localStorage.getItem('paschal_supabase_url') || '');
        setSupabaseAnonKey(cfg.supabaseAnonKey || localStorage.getItem('paschal_supabase_key') || '');
        setBucketName(cfg.bucketName || 'property-images');
      }
    } catch (err) {
      console.warn('Failed to load auxiliary dashboard data:', err);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      await api.login(username.trim(), password);
      setIsLoggedIn(true);
      setPassword('');
      await loadDashboardData();
    } catch (err: any) {
      setLoginError(err?.message || 'Invalid username or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsLoggedIn(false);
  };

  // Availability toggle
  const handleToggleAvailability = async (id: string, currentStatus: AvailabilityStatus) => {
    const nextStatus: AvailabilityStatus = 
      currentStatus === 'Available' ? 'Under Offer' :
      currentStatus === 'Under Offer' ? 'Leased' : 'Available';

    try {
      await api.updateAvailability(id, nextStatus);
      await onRefreshProperties();
      showSuccess(`Status updated to ${nextStatus}`);
    } catch (err: any) {
      alert(`Error updating availability: ${err?.message}`);
    }
  };

  // Delete property
  const handleDeleteProperty = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the listing "${title}"?`)) return;
    try {
      setActionLoading(true);
      await api.deleteProperty(id);
      await onRefreshProperties();
      showSuccess('Property deleted successfully');
    } catch (err: any) {
      alert(`Error deleting property: ${err?.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Supabase test and save
  const handleTestAndSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseTesting(true);
    setSupabaseStatus(null);

    try {
      const result = await testSupabaseConnection(supabaseUrl.trim(), supabaseAnonKey.trim());
      setSupabaseStatus(result);

      if (result.success) {
        localStorage.setItem('paschal_supabase_url', supabaseUrl.trim());
        localStorage.setItem('paschal_supabase_key', supabaseAnonKey.trim());

        await api.saveSupabaseConfig({
          supabaseUrl: supabaseUrl.trim(),
          supabaseAnonKey: supabaseAnonKey.trim(),
          bucketName: bucketName.trim(),
          isConnected: true,
        });
      }
    } catch (err: any) {
      setSupabaseStatus({ success: false, message: err?.message || 'Connection failed' });
    } finally {
      setSupabaseTesting(false);
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleSyncDatabase = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await api.syncSupabaseDatabase();
      setSyncMessage({ success: true, text: res.message });
      await onRefreshProperties();
    } catch (err: any) {
      setSyncMessage({ success: false, text: err?.message || 'Sync failed. Ensure SQL schema is executed in Supabase.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setPwdMsg({ success: false, text: 'New passwords do not match' });
      return;
    }
    if (newPwd.length < 8) {
      setPwdMsg({ success: false, text: 'New password must be at least 8 characters' });
      return;
    }

    setPwdLoading(true);
    setPwdMsg(null);

    try {
      const res = await api.changePassword(currentPwd, newPwd);
      setPwdMsg({ success: true, text: res.message });
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err: any) {
      setPwdMsg({ success: false, text: err?.message || 'Failed to update password' });
    } finally {
      setPwdLoading(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN FORM
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#121217] border border-[#262633] rounded-2xl shadow-2xl p-8 text-white space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Administrator Access</h2>
            <p className="text-xs text-zinc-400">PASCHAL REALTY Central Management Console</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#171720] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#171720] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 gold-button-gradient text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-md shadow-[#D4AF37]/15 disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Secure Admin Sign In</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN CONSOLE
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#202028] gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
              System Authorized: paschal
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Paschal Realty Administration Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingProperty(null);
              setIsModalOpen(true);
            }}
            className="gold-button-gradient px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Property</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 bg-[#171720] hover:bg-[#252530] text-zinc-300 hover:text-white border border-[#2B2B38] text-xs font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-3.5 rounded bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#22222B] mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('properties')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'properties'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Properties ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'enquiries'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Tenant Enquiries ({enquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'supabase'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Supabase Database & Storage</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Passwords</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: PROPERTIES MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="bg-[#121217] border border-[#22222A] rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-[#171720] text-zinc-400 uppercase tracking-wider border-b border-[#242430]">
                  <tr>
                    <th className="px-5 py-3.5">Property</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Annual Rent</th>
                    <th className="px-4 py-3.5">Availability</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E26]">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-[#16161D] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images[0] || '/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg'}
                            alt={prop.title}
                            className="w-14 h-10 object-cover rounded border border-zinc-800 shrink-0"
                          />
                          <div>
                            <p className="font-serif font-bold text-white text-sm line-clamp-1">{prop.title}</p>
                            <p className="font-mono text-[11px] text-[#D4AF37]">{prop.refCode}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-zinc-300 font-medium">
                        {prop.category}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-zinc-400">
                        {prop.neighborhood}, {prop.city}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-bold text-[#F3E5AB] tabular-nums">
                        {formatNaira(prop.priceNaira)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(prop.id, prop.availability)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                            prop.availability === 'Available'
                              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400 hover:bg-emerald-900/60'
                              : prop.availability === 'Under Offer'
                              ? 'bg-amber-950/60 border-amber-700/60 text-amber-400 hover:bg-amber-900/60'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                          }`}
                          title="Click to toggle status (Available -> Under Offer -> Leased)"
                        >
                          {prop.availability}
                        </button>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProperty(prop);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-white bg-[#1C1C24] hover:bg-[#2A2A38] rounded transition-colors"
                            title="Edit Listing"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(prop.id, prop.title)}
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 rounded transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TENANT ENQUIRIES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          {enquiriesLoading ? (
            <div className="text-center py-12 text-zinc-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
              <span>Loading tenant enquiries...</span>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-16 bg-[#121217] border border-[#22222A] rounded-xl text-zinc-400 text-xs">
              No client enquiries submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-[#121217] border border-[#22222B] rounded-xl p-5 space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div>
                      <p className="font-serif font-bold text-white text-base">{enq.fullName}</p>
                      <p className="text-[11px] text-[#D4AF37] font-mono">
                        {enq.propertyRefCode} · {new Date(enq.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#1C1C26] border border-zinc-700 text-zinc-300">
                      {enq.status}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-300 space-y-2">
                    <p>
                      <strong className="text-zinc-500">Property:</strong> {enq.propertyTitle}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <a href={`tel:${enq.phone}`} className="hover:underline font-mono text-white">
                        {enq.phone}
                      </a>
                    </p>
                    {enq.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <a href={`mailto:${enq.email}`} className="hover:underline text-zinc-300">
                          {enq.email}
                        </a>
                      </p>
                    )}
                    {enq.preferredDate && (
                      <p className="flex items-center gap-2 text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Inspection: {enq.preferredDate} at {enq.preferredTime || 'Morning'}</span>
                      </p>
                    )}
                    <div className="bg-[#181822] p-3 rounded text-zinc-300 border border-zinc-800/80 leading-relaxed mt-2">
                      &ldquo;{enq.message}&rdquo;
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppUrl(`Hello ${enq.fullName}, this is Paschal Realty following up on your luxury property inspection request.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold rounded flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp Client</span>
                      </a>
                    </div>

                    <button
                      onClick={async () => {
                        await api.deleteEnquiry(enq.id);
                        setEnquiries(enquiries.filter((e) => e.id !== enq.id));
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: SUPABASE INTEGRATION & STORAGE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'supabase' && (
        <div className="space-y-8">
          
          {/* Supabase Connection Setup Card */}
          <div className="bg-[#121217] border border-[#242432] rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Supabase Database & Storage Integration</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white mt-1">
                Connect External Supabase Project
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Connect your hosted PostgreSQL database and Storage bucket on Supabase. Only the Project URL and Publishable Anon Key are used. Service role secrets are never requested or exposed.
              </p>
            </div>

            {supabaseStatus && (
              <div
                className={`p-4 rounded text-xs border ${
                  supabaseStatus.success
                    ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300'
                    : 'bg-red-950/50 border-red-800 text-red-300'
                }`}
              >
                {supabaseStatus.message}
              </div>
            )}

            <form onSubmit={handleTestAndSaveSupabase} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Supabase Project URL (e.g. https://your-project.supabase.co)
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzabcdefg.supabase.co"
                  className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-sm text-white font-mono placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Supabase Publishable / Anon Key
                </label>
                <input
                  type="password"
                  required
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-sm text-white font-mono placeholder-zinc-500 focus:outline-none"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Located in your Supabase Dashboard -&gt; Project Settings -&gt; API -&gt; Project API keys (anon / public).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Supabase Storage Bucket Name
                </label>
                <input
                  type="text"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  placeholder="property-images"
                  className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={supabaseTesting}
                  className="gold-button-gradient px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {supabaseTesting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Connection...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Test & Save Config</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSyncDatabase}
                  disabled={syncing}
                  className="px-5 py-2.5 bg-[#1F1F2C] hover:bg-[#2A2A3C] border border-[#3A3A4E] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {syncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Syncing to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 text-[#D4AF37]" />
                      <span>Sync Properties to Supabase</span>
                    </>
                  )}
                </button>
              </div>

              {syncMessage && (
                <div
                  className={`p-3.5 rounded text-xs border ${
                    syncMessage.success
                      ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300'
                      : 'bg-amber-950/50 border-amber-800 text-amber-200'
                  }`}
                >
                  {syncMessage.text}
                </div>
              )}
            </form>
          </div>

          {/* Database Schema Setup & Copy */}
          <div className="bg-[#121217] border border-[#242432] rounded-xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  PostgreSQL Schema & Storage Policy Setup Script
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Execute this SQL in your Supabase SQL Editor to initialize the <code className="text-[#D4AF37]">properties</code> and <code className="text-[#D4AF37]">enquiries</code> tables and public <code className="text-[#D4AF37]">property-images</code> storage bucket.
                </p>
              </div>

              <button
                onClick={handleCopySchema}
                className="px-4 py-2.5 bg-[#1C1C26] hover:bg-[#282836] border border-[#333342] text-xs font-bold text-white rounded flex items-center gap-2 cursor-pointer shrink-0"
              >
                {copiedSchema ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
                <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            {/* Helpful Note for Supabase Safety Modal */}
            <div className="p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-lg text-xs text-amber-200/90 flex items-start gap-2.5">
              <span className="text-amber-400 font-bold shrink-0">ℹ️ Note:</span>
              <span>
                If Supabase displays a <strong className="text-white">"Potential issue detected / Run query only if you intend these changes"</strong> confirmation, simply tap the orange <strong className="text-amber-300">"Run query"</strong> button. This is standard PostgreSQL security confirmation for creating tables and bucket access policies.
              </span>
            </div>

            <div className="bg-[#0A0A0D] border border-zinc-800 rounded-lg p-4 max-h-72 overflow-y-auto font-mono text-xs text-zinc-300">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: SECURITY & CREDENTIALS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <div className="max-w-2xl bg-[#121217] border border-[#242432] rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-white">
              Update Administrator Password
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Passwords are salted and hashed server-side using SHA-512 PBKDF2 with 10,000 rounds. No plain-text passwords exist in client code.
            </p>
          </div>

          {pwdMsg && (
            <div
              className={`p-3.5 rounded text-xs border ${
                pwdMsg.success
                  ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300'
                  : 'bg-red-950/50 border-red-800 text-red-300'
              }`}
            >
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="Current password"
                className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                New Password (Minimum 8 Characters)
              </label>
              <input
                type="password"
                required
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="New strong password"
                className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="gold-button-gradient px-6 py-3 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {pwdLoading ? 'Saving...' : 'Update Admin Password'}
            </button>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PROPERTY CREATE / EDIT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <PropertyFormModal
          property={editingProperty}
          onClose={() => setIsModalOpen(false)}
          onSaved={async () => {
            setIsModalOpen(false);
            await onRefreshProperties();
            showSuccess(editingProperty ? 'Property updated successfully' : 'New property added to portfolio');
          }}
        />
      )}

    </div>
  );
};

// -------------------------------------------------------------
// SUBCOMPONENT: PROPERTY FORM MODAL (CREATE / EDIT)
// -------------------------------------------------------------
interface PropertyFormModalProps {
  property: Property | null;
  onClose: () => void;
  onSaved: () => void;
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  property,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState(property?.title || '');
  const [refCode, setRefCode] = useState(property?.refCode || `PR-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<PropertyCategory>(property?.category || 'Waterfront Villa');
  const [city, setCity] = useState<'Lagos' | 'Abuja' | 'Port Harcourt'>(property?.city || 'Lagos');
  const [location, setLocation] = useState(property?.location || '');
  const [neighborhood, setNeighborhood] = useState(property?.neighborhood || 'Banana Island');
  const [priceNaira, setPriceNaira] = useState(property?.priceNaira || 45000000);
  const [serviceChargeNaira, setServiceChargeNaira] = useState(property?.serviceChargeNaira || 3500000);
  const [bedrooms, setBedrooms] = useState(property?.bedrooms || 5);
  const [bathrooms, setBathrooms] = useState(property?.bathrooms || 5);
  const [parkingSpaces, setParkingSpaces] = useState(property?.parkingSpaces || 4);
  const [areaSqm, setAreaSqm] = useState(property?.areaSqm || 500);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>(property?.furnishing || 'Fully Furnished');
  const [availability, setAvailability] = useState<AvailabilityStatus>(property?.availability || 'Available');
  const [featured, setFeatured] = useState(property?.featured ?? true);
  const [description, setDescription] = useState(property?.description || '');
  const [yearBuilt, setYearBuilt] = useState(property?.yearBuilt || 2024);
  const [amenities, setAmenities] = useState<string[]>(property?.amenities || [
    '24/7 Guaranteed Power',
    'Swimming Pool',
    'Smart Home Automation',
    'Boys Quarters (BQ)',
    'Armed Patrol & CCTV'
  ]);

  // Images state
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>(
    property?.images || ['/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg']
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const uploadedUrl = await api.uploadImage(dataUrl, file.name);
          setImages([...images, uploadedUrl]);
        } catch (err: any) {
          // If server upload failed, fallback to data URL directly
          setImages([...images, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert('Failed to process image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleAmenity = (item: string) => {
    setAmenities(
      amenities.includes(item)
        ? amenities.filter((a) => a !== item)
        : [...amenities, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setError('Title and location are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Partial<Property> = {
      title: title.trim(),
      refCode: refCode.trim(),
      category,
      city,
      location: location.trim(),
      neighborhood,
      priceNaira: Number(priceNaira),
      pricePeriod: 'per year',
      serviceChargeNaira: Number(serviceChargeNaira),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      parkingSpaces: Number(parkingSpaces),
      areaSqm: Number(areaSqm),
      furnishing,
      availability,
      featured,
      description: description.trim(),
      yearBuilt: Number(yearBuilt),
      amenities,
      images: images.length > 0 ? images : ['/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg'],
    };

    try {
      if (property) {
        await api.updateProperty(property.id, payload);
      } else {
        await api.createProperty(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err?.message || 'Failed to save property listing');
    } finally {
      setSaving(false);
    }
  };

  // Lock background body scroll when modal is active
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-hidden">
      <div className="relative w-full max-w-3xl bg-[#111116] border border-[#2D2D3A] rounded-xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div>
            <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
              {property ? 'Edit Property' : 'New Listing'}
            </p>
            <h3 className="text-xl font-serif font-bold text-white">
              {property ? property.title : 'Upload Luxury Property'}
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Title & Ref Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-zinc-300 mb-1 font-semibold">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Sovereign Waterfront Villa"
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] focus:border-[#D4AF37] rounded text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Reference Code</label>
              <input
                type="text"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] focus:border-[#D4AF37] rounded text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Category, City, Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Property Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== 'All Types').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">City</label>
              <select
                value={city}
                onChange={(e: any) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              >
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Neighborhood</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Banana Island"
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Full Location Address */}
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Full Address / Location *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Zone A, Banana Island, Ikoyi, Lagos"
              className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Annual Rent (NGN ₦) *</label>
              <input
                type="number"
                required
                value={priceNaira}
                onChange={(e) => setPriceNaira(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white font-mono focus:outline-none"
              />
              <span className="text-[11px] text-zinc-500">{formatNaira(priceNaira)} / year</span>
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Service Charge (NGN ₦)</label>
              <input
                type="number"
                value={serviceChargeNaira}
                onChange={(e) => setServiceChargeNaira(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white font-mono focus:outline-none"
              />
              <span className="text-[11px] text-zinc-500">{formatNaira(serviceChargeNaira)} / year</span>
            </div>
          </div>

          {/* Specs: Bedrooms, Baths, Area, Parking */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Area (sqm)</label>
              <input
                type="number"
                value={areaSqm}
                onChange={(e) => setAreaSqm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Parking Spaces</label>
              <input
                type="number"
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Furnishing & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e: any) => setFurnishing(e.target.value)}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              >
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Availability</label>
              <select
                value={availability}
                onChange={(e: any) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="Under Offer">Under Offer</option>
                <option value="Leased">Leased</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="feat"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-[#D4AF37] rounded"
              />
              <label htmlFor="feat" className="text-zinc-300 font-semibold cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of finishes, view, staff quarters, and architectural highlights..."
              className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none resize-none"
            />
          </div>

          {/* Amenities selection */}
          <div>
            <label className="block text-zinc-300 mb-2 font-semibold">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITIES_LIST.map((am) => (
                <label key={am} className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={amenities.includes(am)}
                    onChange={() => toggleAmenity(am)}
                    className="accent-[#D4AF37] rounded"
                  />
                  <span>{am}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <label className="block text-zinc-300 font-semibold">Property Photos</label>
            
            {/* Image URLs input and File upload */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste image URL (or asset path)..."
                className="flex-1 px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-[#252532] hover:bg-[#323242] text-white rounded font-semibold"
              >
                Add URL
              </button>

              <label className="px-4 py-2 bg-[#1B1B25] hover:bg-[#252535] border border-zinc-700 text-zinc-200 rounded font-semibold flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Thumbnail previews */}
            <div className="flex flex-wrap gap-3 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-16 rounded overflow-hidden border border-zinc-700 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="gold-button-gradient px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded cursor-pointer shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : property ? 'Update Property' : 'Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
