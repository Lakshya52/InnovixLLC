"use client";

import React, { useState, useRef } from "react";
import { User, Check, Image as ImageIcon, Lock, Shield, MoreVertical, Eye, EyeOff, UserPlus, Fingerprint, Edit2, Trash2, X } from "lucide-react";
import { updateAdminProfile, addAdmin } from "@/actions/admin-settings";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/image-utils";

const AVATAR_STYLES = [
  "avataaars",
  "bottts",
  "adventurer",
  "fun-emoji",
  "pixel-art",
  "notionists"
];

export default function SettingsClient({ currentUser, initialAdmins }: { currentUser: any, initialAdmins: any[] }) {
  const [profilePic, setProfilePic] = useState(currentUser.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + currentUser.id);
  const [name, setName] = useState(currentUser.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = React.useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsCropping(true);
        setShowAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedImage) {
        setProfilePic(croppedImage);
        setIsCropping(false);
        setImageToCrop(null);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image");
    }
  };

  const selectAvatar = (style: string) => {
    const newImage = `https://api.dicebear.com/7.x/${style}/svg?seed=${currentUser.email || currentUser.id}`;
    setProfilePic(newImage);
    setShowAvatarPicker(false);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (profilePic !== currentUser.image) {
      formData.append("image", profilePic);
    }

    if (newPassword) {
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);
    }

    const result = await updateAdminProfile(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert("Settings updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminLoading(true);
    const formData = new FormData();
    formData.append("name", newAdminName);
    formData.append("email", newAdminEmail);
    formData.append("password", newAdminPassword);

    const result = await addAdmin(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert("Admin added successfully!");
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPassword("");
    }
    setAddAdminLoading(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mb-12">
      {/* Top Section */}
      <div className="bg-[#1C1C1C] rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row gap-12 relative overflow-hidden shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#6eDD86] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />

        {/* Profile Identity (Left) */}
        <div className="flex flex-col items-center gap-6 w-full md:w-[30%]">
          <div className="w-full flex items-center justify-start gap-2 mb-2">
            <Fingerprint className="text-(--accent)" size={20} />
            <h2 className="text-white font-semibold text-lg">Profile Identity</h2>
          </div>

          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-[#242424] border border-white/10 overflow-hidden relative shadow-lg">
              <img src={profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder"} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-2 -right-2 bg-[#6eDD86] w-9 h-9 rounded-full flex items-center justify-center text-black hover:scale-110 transition-all cursor-pointer z-10 box-content border-4 border-[#1C1C1C]"
            >
              {showAvatarPicker ? <X size={14} /> : <Edit2 size={14} />}
            </button>
            {showAvatarPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 items-center justify-center z-50 h-fit w-fit shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex gap-4">
                  {AVATAR_STYLES.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => selectAvatar(style)}
                      className="w-10 h-10 cursor-pointer rounded-lg overflow-hidden border border-white/5 hover:border-[#6eDD86] transition-all bg-[#242424]"
                    >
                      <img src={`https://api.dicebear.com/7.x/${style}/svg?seed=${currentUser.email || currentUser.id}`} className="h-full w-full object-cover" alt={style} />
                    </button>
                  ))}
                </div>
                <div className="relative flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-3 w-full hover:border-[#6eDD86] transition-all cursor-pointer group/upload">
                  <div className="flex flex-col items-center gap-1 pointer-events-none">
                    <Edit2 size={16} className="text-gray-500 group-hover/upload:text-[#6eDD86]" />
                    <span className="text-[9px] font-bold text-gray-500 group-hover/upload:text-[#6eDD86]">UPLOAD PHOTO</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-white">{name || "Admin"}</h3>
            <p className="text-gray-400 text-sm mt-1">{currentUser.role === "ADMIN" ? "Head of Operations" : "Administrator"}</p>
          </div>

          <button
            onClick={() => setProfilePic("")}
            className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider py-2.5 px-6 rounded-full border border-white/10 hover:bg-white/5 transition-all mt-2 cursor-pointer"
          >
            Remove Photo
          </button>
        </div>

        {/* Account Credentials & Personal Info (Right) */}
        <div className="flex flex-col w-full md:w-[70%] z-10 pt-2">

          <div className="mb-10">
            <h3 className="text-[#6eDD86] font-bold text-xs uppercase tracking-widest mb-6">Account Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 ml-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#2A2A2A] border border-transparent hover:border-white/10 focus:border-[#6eDD86]/50 rounded-full px-5 py-3.5 text-white text-sm outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_15px_rgba(110,221,134,0.1)] w-full"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#2A2A2A] border border-transparent hover:border-white/10 focus:border-[#6eDD86]/50 rounded-full px-5 py-3.5 text-white text-sm outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_15px_rgba(110,221,134,0.1)] w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-[#6eDD86] font-bold text-[10px] uppercase tracking-widest mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 ml-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#2A2A2A] border border-transparent hover:border-white/10 focus:border-[#6eDD86]/50 rounded-full px-5 py-3.5 text-white text-sm outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_15px_rgba(110,221,134,0.1)] w-full"
                  placeholder="John Doe"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-auto">
            <button className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-[#333333] hover:bg-[#444] rounded-full transition-all cursor-pointer">
              Discard Changes
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-[#6eDD86] hover:bg-[#5dbb72] text-[#131313] px-8 py-3.5 rounded-full text-[10px] font-bold w-[160px] uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(110,221,134,0.3)] hover:shadow-[0_0_25px_rgba(110,221,134,0.5)] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Admin Team Management */}
        <div className="lg:col-span-3 bg-[#1C1C1C] rounded-2xl p-8 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#6eDD86] opacity-[0.02] blur-[80px] pointer-events-none rounded-full" />

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="text-(--accent)" size={20} />
              <h2 className="text-white font-semibold text-lg">Admin Team Management</h2>
            </div>
            <button className="text-[10px] text-gray-400 hover:text-white uppercase tracking-wider font-bold flex items-center gap-1 group transition-colors">
              View Audit Log <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {initialAdmins.map((admin, idx) => (
              <div key={admin.id} className="bg-[#1A1A1A] border border-white/5 hover:border-white/10 rounded-full py-3 px-5 flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <img src={admin.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.id}`} alt={admin.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Active indicator dot */}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#6eDD86] border-[2px] border-[#1C1C1C] rounded-full"></div>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-white font-bold text-sm tracking-wide">{admin.name}</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-0.5">
                      {idx === 0 ? "SUPER ADMIN" : idx === 1 ? "SECURITY LEAD" : "LICENSE MANAGER"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Last active</p>
                    <p className="text-[#6eDD86] text-xs font-semibold">
                      {idx === 0 ? "Just now" : idx === 1 ? "2h ago" : "Just now"}
                    </p>
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 cursor-pointer">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
            {initialAdmins.length === 0 && (
              <p className="text-gray-500 text-sm py-4">No other admins found.</p>
            )}
          </div>
        </div>

        {/* Add New Admin */}
        <div className="lg:col-span-2 bg-[#1C1C1C] rounded-2xl p-8 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-10 right-0 w-40 h-40 bg-[#6eDD86] opacity-[0.03] blur-[60px] pointer-events-none rounded-full" />

          <div className="flex items-center gap-3 mb-8">
            <UserPlus className="text-(--accent)" size={20} />
            <h2 className="text-white font-semibold text-lg">Add New Admin</h2>
          </div>

          <form onSubmit={handleAddAdmin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 ml-1">Full Name</label>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                required
                className="bg-[#2A2A2A] border border-transparent hover:border-white/10 focus:border-[#6eDD86]/50 rounded-full px-5 py-3.5 text-white text-sm outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] w-full"
                placeholder="Jane Smith"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 ml-1">Work Email</label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
                className="bg-[#2A2A2A] border border-transparent hover:border-white/10 focus:border-[#6eDD86]/50 rounded-full px-5 py-3.5 text-white text-sm outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] w-full"
                placeholder="jane@innovix.com"
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showNewAdminPassword ? "text" : "password"}
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                  className="bg-[#2A2A2A] border border-transparent hover:border-white/10 focus:border-[#6eDD86]/50 rounded-full pl-5 pr-12 py-3.5 text-white text-sm outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] w-full"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showNewAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={addAdminLoading}
              className="mt-4 bg-[#6eDD86] hover:bg-[#5dbb72] text-[#131313] w-full py-3.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(110,221,134,0.2)] hover:shadow-[0_0_25px_rgba(110,221,134,0.4)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addAdminLoading ? "Adding..." : "Add Account"}
            </button>
          </form>
        </div>
      </div>

      {/* Image Cropper Overlay */}
      {isCropping && imageToCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#131313]/90 backdrop-blur-md p-4">
          <div className="bg-[#1C1C1C] border border-white/10 rounded-[2rem] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[#6eDD86] font-bold text-sm tracking-wider uppercase">Crop Profile Picture</h3>
              <button onClick={() => setIsCropping(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="relative h-96 w-full bg-black">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Zoom Level</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#6eDD86]"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  onClick={() => setIsCropping(false)}
                  className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveCrop}
                  className="bg-[#6eDD86] hover:bg-[#5dbb72] text-[#131313] px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(110,221,134,0.3)] hover:shadow-[0_0_25px_rgba(110,221,134,0.5)] cursor-pointer flex items-center gap-2"
                >
                  <Check size={14} />
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
