/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { UserProfileData } from "@/lib/persistence";

interface EditProfileModalProps {
  currentProfile: UserProfileData;
  onSave: (profile: Partial<UserProfileData>) => void;
  onClose: () => void;
}

export default function EditProfileModal({
  currentProfile,
  onSave,
  onClose,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(currentProfile.displayName);
  const [username, setUsername] = useState(currentProfile.username);
  const [bio, setBio] = useState(currentProfile.bio);
  const [avatarSeed, setAvatarSeed] = useState(currentProfile.avatarSeed);

  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const handleSave = () => {
    onSave({
      displayName: displayName.trim() || "Literary Explorer",
      username: username.trim() || "explorer",
      bio: bio.trim(),
      avatarSeed: avatarSeed.trim() || "explorer",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-100">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-500 to-orange-600 p-0.5">
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-full h-full rounded-full bg-zinc-800"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={40}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              placeholder="Literary Explorer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="flex items-center">
              <span className="text-zinc-500 mr-1">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))
                }
                maxLength={20}
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                placeholder="explorer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 resize-none"
              placeholder="Discovering the lineage of ideas."
            />
            <p className="text-xs text-zinc-600 mt-1">{bio.length}/160</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
              Avatar Seed
            </label>
            <input
              type="text"
              value={avatarSeed}
              onChange={(e) => setAvatarSeed(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              placeholder="Type anything for a unique avatar"
            />
            <p className="text-xs text-zinc-600 mt-1">
              Change to generate a different avatar
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-amber-500 text-zinc-900 font-medium rounded-lg hover:bg-amber-400 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
