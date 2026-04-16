"use client";

import React, { useState, useCallback } from "react";
import { User, Shield, BellRing, Fingerprint, Edit2, Check, Loader2, X } from "lucide-react";
import { updateProfile, updatePreferences, requestPasswordOTP, verifyAndChangePassword, updateUserImage } from "@/actions/user";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/image-utils";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  marketingEmails: boolean;
  transactionalEmails: boolean;
}

const AVATAR_STYLES = [
  "avataaars",
  "bottts",
  "adventurer",
  "fun-emoji",
  "pixel-art",
  "notionists"
];

export default function SettingsForm({ initialUser }: { initialUser: UserData }) {
  const [user, setUser] = useState(initialUser);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Cropping states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  // Password flow states
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedImage) {
        // Update local state
        setUser(prev => ({ ...prev, image: croppedImage }));
        setIsCropping(false);
        setImageToCrop(null);
        setShowAvatarPicker(false);

        // Auto-save to DB
        const result = await updateUserImage(croppedImage);
        if (result.success) {
          alert("Profile picture updated and saved!");
        } else {
          alert(result.error || "Failed to save profile picture");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("image", user.image || "");

    const result = await updateProfile(formData);
    if (result.success) {
      alert("Profile updated successfully");
    } else {
      alert(result.error || "Failed to update profile");
    }
    setIsUpdatingProfile(false);
  };

  const handleTogglePreference = async (type: 'marketing' | 'transactional') => {
    const newMarketing = type === 'marketing' ? !user.marketingEmails : user.marketingEmails;
    const newTransactional = type === 'transactional' ? !user.transactionalEmails : user.transactionalEmails;

    // Optimistic update
    setUser(prev => ({
      ...prev,
      marketingEmails: newMarketing,
      transactionalEmails: newTransactional
    }));

    const result = await updatePreferences(newMarketing, newTransactional);
    if (!result.success) {
      alert(result.error || "Failed to update preference");
      // Rollback
      setUser(initialUser);
    }
  };

  const handleRequestOTP = async () => {
    setIsSendingOtp(true);
    const result = await requestPasswordOTP();
    if (result.success) {
      setOtpSent(true);
      alert("OTP sent to your email");
    } else {
      alert(result.error || "Failed to send OTP");
    }
    setIsSendingOtp(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    const formData = new FormData();
    formData.append("otp", passwordData.otp);
    formData.append("newPassword", passwordData.newPassword);
    formData.append("confirmPassword", passwordData.confirmPassword);

    const result = await verifyAndChangePassword(formData);
    if (result.success) {
      alert("Password updated successfully");
      setOtpSent(false);
      setPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
    } else {
      alert(result.error || "Failed to update password");
    }
    setIsChangingPassword(false);
  };

  const selectAvatar = async (style: string) => {
    const newImage = `https://api.dicebear.com/7.x/${style}/svg?seed=${user.email}`;
    // Update local state
    setUser(prev => ({ ...prev, image: newImage }));
    setShowAvatarPicker(false);

    // Auto-save to DB
    const result = await updateUserImage(newImage);
    if (result.success) {
      alert("Avatar updated and saved!");
    } else {
      alert(result.error || "Failed to save avatar");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Profile Information */}
      <form onSubmit={handleUpdateProfile} className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-10 relative group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#1a1a1a]/40 rounded-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110"></div>
        <Fingerprint size={80} className="absolute top-10 right-10 text-[#222] pointer-events-none" />

        <div className="flex items-center gap-3 mb-10 text-[#6eDD86]">
          <User size={20} />
          <h2 className="text-xl font-bold">Profile Information</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-[#1f1f1f] group-hover:border-[#6eDD86]/30 transition-all bg-[#1a1a1a]">
              <img
                src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-2 -right-2 bg-[#6eDD86] w-9 h-9 rounded-full flex items-center justify-center border-4 border-[#121212] text-black cursor-pointer hover:bg-[#5dbb72] transition-colors shadow-lg active:scale-90"
            >
              {showAvatarPicker ? <X size={16} /> : <Edit2 size={16} />}
            </button>

            {showAvatarPicker && (
              <div className="absolute top-full left-0 mt-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-5 items-center justify-center z-50 h-fit w-fit shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex gap-5 ">
                  {AVATAR_STYLES.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => selectAvatar(style)}
                      className="w-10 h-10 cursor-pointer rounded-lg overflow-hidden border border-[#2a2a2a] hover:border-[#6eDD86] transition-all"
                    >
                      <img src={`https://api.dicebear.com/7.x/${style}/svg?seed=${user.email}`} className="h-full w-full object-cover" alt={style} />
                    </button>
                  ))}
                </div>
                <div className="relative flex items-center justify-center border-2 border-dashed border-[#6eDD86]/30 rounded-xl p-4 w-full hover:border-[#6eDD86] transition-all cursor-pointer group/upload">
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <Edit2 size={20} className="text-[#6eDD86]/50 group-hover/upload:text-[#6eDD86]" />
                    <span className="text-[10px] font-bold text-[#666] group-hover/upload:text-[#6eDD86]">UPLOAD PHOTO</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow w-full">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">FULL NAME</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name || ''}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-[#e2e2e2] outline-none focus:border-[#6eDD86]/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">EMAIL ADDRESS</label>
              <div className="relative">
                <input type="email" value={user.email} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-[#e2e2e2] outline-none opacity-50 cursor-not-allowed" disabled />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="bg-[#6eDD86] text-black px-8 py-3 rounded-xl font-bold text-xs hover:bg-[#5dbb72] transition-colors flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(110,221,134,0.1)] active:scale-95"
              >
                {isUpdatingProfile ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Image Cropper Overlay */}
      {isCropping && imageToCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#1f1f1f] flex items-center justify-between">
              <h3 className="text-[#6eDD86] font-bold tracking-tight">CROP PROFILE PICTURE</h3>
              <button onClick={() => setIsCropping(false)} className="text-[#666] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="relative h-96 w-full bg-[#000]">
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
                <label className="text-[10px] font-bold text-[#666] tracking-widest uppercase">ZOOM LEVEL</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#6eDD86]"
                />
              </div>
              
              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  onClick={() => setIsCropping(false)}
                  className="text-[#666] hover:text-[#e2e2e2] font-bold text-xs transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveCrop}
                  className="bg-[#6eDD86] text-black px-10 py-3 rounded-2xl font-bold text-xs hover:bg-[#5dbb72] transition-all shadow-[0_0_30px_rgba(110,221,134,0.2)] active:scale-95 flex items-center gap-2"
                >
                  <Check size={16} />
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Authentication */}
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-10 space-y-8">
          <div className="flex items-center gap-3 text-[#6eDD86]">
            <Shield size={20} />
            <h2 className="text-xl font-bold">Authentication</h2>
          </div>

          {!otpSent ? (
            <div className="space-y-6">
              <p className="text-sm text-[#a0a0a0]">To change your password, we need to verify your identity by sending a one-time password (OTP) to your registered email.</p>
              <button
                onClick={handleRequestOTP}
                disabled={isSendingOtp}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-8 py-3 rounded-xl text-xs font-bold hover:bg-[#222] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSendingOtp && <Loader2 size={14} className="animate-spin" />}
                Get Verification OTP
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">VERIFICATION OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white placeholder:text-[#333]"
                  value={passwordData.otp}
                  onChange={(e) => setPasswordData({ ...passwordData, otp: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">NEW PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white placeholder:text-[#333]"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white placeholder:text-[#333]"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-[#6eDD86] text-black px-8 py-3 rounded-xl font-bold text-xs hover:bg-[#5dbb72] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isChangingPassword && <Loader2 size={14} className="animate-spin" />}
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[#666] hover:text-[#e2e2e2] text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-10 space-y-10">
          <div className="flex items-center gap-3 text-[#6eDD86]">
            <BellRing size={20} />
            <h2 className="text-xl font-bold">Preferences</h2>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between group">
              <div>
                <h4 className="text-sm font-bold text-[#e2e2e2] mb-1 group-hover:text-[#6eDD86] transition-colors">Marketing Communication</h4>
                <p className="text-[11px] text-[#666] font-medium leading-tight">New product updates and offers</p>
              </div>
              <div
                onClick={() => handleTogglePreference('marketing')}
                className={`w-12 h-6 rounded-full relative cursor-pointer border transition-all ${user.marketingEmails ? 'bg-[#6eDD86]/20 border-[#6eDD86]/30' : 'bg-[#1a1a1a] border-[#2a2a2a]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${user.marketingEmails ? 'right-1 bg-[#6eDD86] shadow-[0_0_10px_rgba(110,221,134,0.5)]' : 'left-1 bg-[#333]'}`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <h4 className="text-sm font-bold text-[#e2e2e2] mb-1 group-hover:text-[#6eDD86] transition-colors">Real-time Notifications</h4>
                <p className="text-[11px] text-[#666] font-medium leading-tight">Immediate alerts for purchases and account activity</p>
              </div>
              <div
                onClick={() => handleTogglePreference('transactional')}
                className={`w-12 h-6 rounded-full relative cursor-pointer border transition-all ${user.transactionalEmails ? 'bg-[#6eDD86]/20 border-[#6eDD86]/30' : 'bg-[#1a1a1a] border-[#2a2a2a]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${user.transactionalEmails ? 'right-1 bg-[#6eDD86] shadow-[0_0_10px_rgba(110,221,134,0.5)]' : 'left-1 bg-[#333]'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
