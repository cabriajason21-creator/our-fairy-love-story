import React, { useState, useEffect } from "react";
import { LoveStoryState, Milestone, GalleryItem, QuizQuestion } from "../types";
import { Globe, Copy, Check, X, Trash2 } from "lucide-react";
import { uploadFileToSupabase, deleteFileFromSupabase } from "../supabase";

interface AdminPanelProps {
  state: LoveStoryState;
  onSave: (updatedState: LoveStoryState) => void;
  onClose: () => void;
  showPasswordPrompt: boolean;
  onPasswordSuccess: () => void;
  onPasswordCancel: () => void;
  clientId?: string;
  onLogout?: () => void;
}

export default function AdminPanel({
  state,
  onSave,
  onClose,
  showPasswordPrompt,
  onPasswordSuccess,
  onPasswordCancel,
  clientId,
  onLogout,
}: AdminPanelProps) {
  // Password State
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Editor State
  const [activeTab, setActiveTab] = useState("general");
  const [editedState, setEditedState] = useState<LoveStoryState | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Uploading status index (key: gallery-index, memory-index, audio)
  const [uploadingIndex, setUploadingIndex] = useState<Record<string, "compressing" | "uploading" | boolean>>({});

  const getFriendlyUploadError = (error: any): string => {
    const msg = error?.message || String(error);
    if (msg.toLowerCase().includes("row-level security") || msg.toLowerCase().includes("rls") || msg.toLowerCase().includes("policy") || msg.toLowerCase().includes("security policy")) {
      return `Supabase Storage Policy Restriction! 🔒\n\n` +
             `To allow user photo/video uploads, you need to create a Public Storage Policy in your Supabase dashboard:\n\n` +
             `1. Go to Supabase Dashboard -> Storage -> select your "media_uploads" bucket.\n` +
             `2. Click on "Policies" (RLS) on the left sidebar or top menu.\n` +
             `3. Under the "media_uploads" bucket, click "New Policy" -> select "Create a policy from scratch" (or "For full customization").\n` +
             `4. Check the box for "INSERT" and "SELECT" (and optionally "UPDATE" / "DELETE") operations.\n` +
             `5. Set the target role to "anon" (and "authenticated" if applicable).\n` +
             `6. Set the policy expression / condition to simply "true" (meaning any user can access) or use the "Allow public access" template.\n` +
             `7. Save and try uploading your image/video again!`;
    }
    return `Upload Failed: ${msg}`;
  };

  /**
   * Compresses an image file using HTML5 Canvas.
   * Resizes the image so that neither width nor height exceeds 1920px.
   * Outputs a compressed JPEG file with 80% quality.
   */
  const compressImage = (file: File, maxWidthHeight = 1920, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize calculation
          if (width > maxWidthHeight || height > maxWidthHeight) {
            if (width > height) {
              height = Math.round((height * maxWidthHeight) / width);
              width = maxWidthHeight;
            } else {
              width = Math.round((width * maxWidthHeight) / height);
              height = maxWidthHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file); // fallback to original file if canvas context is unavailable
            return;
          }

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas content to blob and then to File
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file); // fallback to original file
                return;
              }
              // Create a new file from the compressed blob
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = (err) => {
          resolve(file); // fallback to original file on error
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => {
        resolve(file); // fallback to original file on error
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (state) {
      const cloned = JSON.parse(JSON.stringify(state));
      if (!cloned.memoryLogGallery) {
        cloned.memoryLogGallery = [];
      }
      setEditedState(cloned);
    }
  }, [state]);

  const handlePasswordSubmit = () => {
    if (password === "ourlove") {
      onPasswordSuccess();
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Hint: ourlove");
    }
  };

  const handleSave = () => {
    if (editedState) {
      // Filter out empty or whitespace-only reasons before saving
      const cleanReasons = editedState.reasons
        .map((r) => r.trim())
        .filter(Boolean);
      
      onSave({
        ...editedState,
        reasons: cleanReasons,
      });
    }
  };

  // Helper file uploader for gallery photos with image compression and size limits (Only Image Assets allowed)
  const handleGalleryMediaUpload = async (index: number, file: File) => {
    if (!editedState) return;

    // Check if user attempts to upload a video file
    const isVideo = (file.type && file.type.startsWith("video/")) || 
                    (file.name && /\.(mp4|webm|ogg|mov|avi|mkv|3gp|flv|wmv)$/i.test(file.name));
    if (isVideo) {
      alert("Only image files are allowed for the Main Hub Carousel. Video files can be uploaded in the Memory Log section!");
      return;
    }

    if (file.type && file.type.startsWith("image/")) {
      const uploadKey = `gallery-${index}`;
      try {
        setUploadingIndex((prev) => ({ ...prev, [uploadKey]: "compressing" }));
        
        // Client-side image compression down to max 1920px dimensions and 80% quality
        const processedFile = await compressImage(file, 1920, 0.8);
        
        setUploadingIndex((prev) => ({ ...prev, [uploadKey]: "uploading" }));
        const publicUrl = await uploadFileToSupabase(processedFile, clientId);
        
        setEditedState((prev) => {
          if (!prev) return prev;
          const updated = JSON.parse(JSON.stringify(prev));
          updated.gallery[index].media = publicUrl;
          updated.gallery[index].mediaType = "image";
          updated.gallery[index].fileName = file.name;
          return updated;
        });
      } catch (error: any) {
        alert(getFriendlyUploadError(error));
      } finally {
        setUploadingIndex((prev) => ({ ...prev, [uploadKey]: false }));
      }
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Helper file uploader for memory log album photos/videos with image compression and size limits
  const handleMemoryLogMediaUpload = async (index: number, file: File) => {
    if (!editedState) return;

    const isVideo = (file.type && file.type.startsWith("video/")) || 
                    (file.name && /\.(mp4|webm|ogg|mov|avi|mkv|3gp|flv|wmv)$/i.test(file.name));
    const mediaType = isVideo ? "video" : "image";

    // Active upload limits check (Photo Limit: 40, Video Limit: 6)
    const currentPhotos = (editedState.memoryLogGallery || []).filter(
      (item) => item.media && item.mediaType === "image"
    ).length;
    const currentVideos = (editedState.memoryLogGallery || []).filter(
      (item) => item.media && item.mediaType === "video"
    ).length;

    if (mediaType === "image" && currentPhotos >= 40) {
      alert("Maximum file limit reached for this album section.");
      return;
    }
    if (mediaType === "video" && currentVideos >= 6) {
      alert("Maximum file limit reached for this album section.");
      return;
    }

    const uploadKey = `memory-${index}`;

    if (isVideo) {
      // Validate video format extension (MP4 and WebM allowed for smooth web streaming)
      const isAllowedFormat = (file.type && (file.type === "video/mp4" || file.type === "video/webm")) ||
                              (file.name && /\.(mp4|webm)$/i.test(file.name));
      if (!isAllowedFormat) {
        alert("Only MP4 and WebM video formats (.mp4, .webm) are allowed for smooth web streaming.");
        return;
      }

      // Check max file size limit of 20 MB
      const maxLimit = 20 * 1024 * 1024; // 20 MB
      if (file.size > maxLimit) {
        alert("Video file exceeds the 20MB size limit. Please upload a shorter or compressed clip.");
        return;
      }
    }

    try {
      let processedFile = file;

      if (mediaType === "image" && file.type && file.type.startsWith("image/")) {
        setUploadingIndex((prev) => ({ ...prev, [uploadKey]: "compressing" }));
        // Client-side image compression down to max 1920px dimensions and 80% quality
        processedFile = await compressImage(file, 1920, 0.8);
      }

      setUploadingIndex((prev) => ({ ...prev, [uploadKey]: "uploading" }));
      const publicUrl = await uploadFileToSupabase(processedFile, clientId);

      setEditedState((prev) => {
        if (!prev) return prev;
        const updated = JSON.parse(JSON.stringify(prev));
        if (!updated.memoryLogGallery) {
          updated.memoryLogGallery = [];
        }
        updated.memoryLogGallery[index].media = publicUrl;
        updated.memoryLogGallery[index].mediaType = mediaType;
        updated.memoryLogGallery[index].fileName = file.name;
        return updated;
      });
    } catch (error: any) {
      alert(getFriendlyUploadError(error));
    } finally {
      setUploadingIndex((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Helper file uploader for audio song
  const handleAudioUpload = async (file: File) => {
    if (!editedState) return;
    try {
      setUploadingIndex((prev) => ({ ...prev, audio: "uploading" }));
      const publicUrl = await uploadFileToSupabase(file, clientId);

      setEditedState((prev) => {
        if (!prev) return prev;
        const updated = JSON.parse(JSON.stringify(prev));
        updated.audioData = publicUrl;
        updated.audioName = file.name;
        return updated;
      });
    } catch (error: any) {
      alert(getFriendlyUploadError(error));
    } finally {
      setUploadingIndex((prev) => ({ ...prev, audio: false }));
    }
  };


  // Password Prompt Modal
  if (showPasswordPrompt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-8 w-[90%] max-w-[320px] text-center shadow-[0_6px_0_#4E2512] relative select-none">
          {/* Ribbon detail */}
          <div className="absolute top-0 right-6 w-5 h-7 bg-[#EF4444] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-sm" />

          <h3 className="font-display font-black text-xl text-[#EA580C] mb-1">
            Admin Access
          </h3>
          <p className="text-xs text-[#4E2512] font-serif font-bold mb-4">
            Enter the password to edit this gift
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePasswordSubmit();
            }}
            placeholder="Password"
            className="w-full px-4 py-2.5 mb-2 rounded-xl border-2 border-[#4E2512] bg-white text-[#4E2512] text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
          {passwordError && (
            <p className="text-xs font-bold text-red-500 min-h-[16px] mb-3">{passwordError}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={onPasswordCancel}
              className="w-1/2 px-4 py-2 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] border-2 border-[#4E2512] text-white font-serif font-black text-xs cursor-pointer shadow-[0_2px_0_#4E2512] active:translate-y-0.5 active:shadow-none"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSubmit}
              className="w-1/2 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] border-2 border-[#4E2512] text-white font-serif font-black text-xs cursor-pointer shadow-[0_2px_0_#4E2512] active:translate-y-0.5 active:shadow-none"
            >
              Enter
            </button>
          </div>
          <p className="text-[10px] text-[#4E2512]/70 font-serif font-bold mt-4">
            Hint: ourlove
          </p>
        </div>
      </div>
    );
  }

  if (!editedState) return null;

  const tabs = [
    { id: "general", label: "General" },
    { id: "timeline", label: "Timeline" },
    { id: "gallery", label: "Gallery" },
    { id: "reasons", label: "Reasons" },
    { id: "quiz", label: "Quiz" },
    { id: "voice", label: "Audio" },
    { id: "finale", label: "Finale" },
    ...(clientId ? [{ id: "share", label: "Live Link" }] : []),
  ];

  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Admin Panel Drawer */}
      <div className="fixed top-0 right-0 h-full w-[90%] sm:w-[420px] lg:w-1/3 lg:min-w-[420px] lg:max-w-[480px] bg-[#FCF6E9] border-l-4 border-[#4E2512] z-50 shadow-2xl flex flex-col overflow-hidden text-[#4E2512] font-sans">
        {/* Header */}
        <div className="p-5 border-b-2 border-[#4E2512] flex-shrink-0 bg-[#FAF4E9]">
          <h2 className="font-display font-black text-xl text-[#EA580C]">
            Edit This Gift
          </h2>
          <p className="text-[10px] text-[#4E2512] font-serif font-bold mt-1">
            Changes save to this browser.
          </p>
        </div>

        {/* Tab Selection */}
        <div
          className="flex flex-row flex-nowrap gap-1.5 p-3 overflow-x-auto border-b-2 border-[#4E2512] flex-shrink-0 bg-[#FAF4E9]/50"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-black whitespace-nowrap cursor-pointer transition-all border-2 border-[#4E2512] shadow-[0_2px_0_#4E2512] active:translate-y-0.5 active:shadow-none ${
                activeTab === tab.id
                  ? "bg-[#EA580C] text-white"
                  : "bg-white text-[#4E2512] hover:bg-[#FFE4E6]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel Form Fields */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB: GENERAL */}

          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="font-display font-black text-sm text-[#EA580C] uppercase tracking-wider">
                ⏳ Countdown Timer
              </h3>
              <div className="space-y-1">
                <label className="text-[10px] font-serif font-black text-[#4E2512] uppercase tracking-wider">
                  Room Title
                </label>
                <input
                  type="text"
                  value={editedState.countdownTitle}
                  onChange={(e) =>
                    setEditedState({
                      ...editedState,
                      countdownTitle: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4E2512] bg-white text-[#4E2512] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-serif font-black text-[#4E2512] uppercase tracking-wider">
                  Target Date
                </label>
                <input
                  type="date"
                  value={editedState.countdownDate}
                  onChange={(e) =>
                    setEditedState({
                      ...editedState,
                      countdownDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4E2512] bg-white text-[#4E2512] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-serif font-black text-[#4E2512] uppercase tracking-wider">
                  Relationship Anniversary Date
                </label>
                <input
                  type="date"
                  value={editedState.anniversaryDate || ""}
                  onChange={(e) =>
                    setEditedState({
                      ...editedState,
                      anniversaryDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4E2512] bg-white text-[#4E2512] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-serif font-black text-[#4E2512] uppercase tracking-wider">
                  Caption Below Countdown
                </label>
                <input
                  type="text"
                  value={editedState.countdownSub}
                  onChange={(e) =>
                    setEditedState({
                      ...editedState,
                      countdownSub: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4E2512] bg-white text-[#4E2512] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>

              {/* Gallery Frame Style Selection */}
              <h3 className="font-display font-black text-sm text-[#EA580C] uppercase tracking-wider mt-6 pt-4 border-t-2 border-[#4E2512]/10">
                🖼️ Gallery Frame Style
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-serif font-black text-[#4E2512] uppercase tracking-wider">
                  Select Border Overlay
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "type1", label: "Fairytale Roses", desc: "Ornate Gold & Pink Roses (Default)" },
                    { id: "type2", label: "Magical Vine/Floral", desc: "Emerald Vine & Pink Blooms" },
                    { id: "type3", label: "Vintage Royal Gold", desc: "Vintage Gold & Crown Corners" },
                    { id: "type4", label: "Soft Ribbon/Hearts", desc: "Pastel Pink Ribbons & Bows" },
                    { id: "type5", label: "Starry Celestial", desc: "Midnight Blue & Gold Stars" },
                    { id: "type6", label: "Enchanted Sakura", desc: "Cherry Blossoms & Pink Sparks" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() =>
                        setEditedState({
                          ...editedState,
                          frameStyle: style.id,
                        })
                      }
                      className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        (editedState.frameStyle || "type1") === style.id
                          ? "border-[#EA580C] bg-[#FFF2E8] shadow-[0_2px_0_#EA580C]"
                          : "border-[#4E2512] bg-white hover:bg-[#FAF4E9] shadow-[0_2px_0_#4E2512]"
                      }`}
                    >
                      <div className="font-serif font-black text-xs text-[#4E2512]">
                        {style.label}
                      </div>
                      <div className="text-[9px] text-[#4E2512]/70 mt-0.5 leading-tight">
                        {style.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SELECT INTERFACE THEME */}
              <h3 className="font-display font-black text-sm text-[#EA580C] uppercase tracking-wider mt-6 pt-4 border-t-2 border-[#4E2512]/10">
                🌓 SELECT INTERFACE THEME
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-serif font-black text-[#4E2512] uppercase tracking-wider">
                  Interface Palette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "day", label: "Day Mode ☀️", desc: "Cozy cream fairytale theme" },
                    { id: "night", label: "Night Mode 🌙", desc: "Deep dark blue celestial theme" },
                  ].map((themeOpt) => (
                    <button
                      key={themeOpt.id}
                      type="button"
                      onClick={() => {
                        const newTheme = themeOpt.id as "day" | "night";
                        const updatedWeather = newTheme === "day" && editedState.weather === "fireflies"
                          ? "none"
                          : editedState.weather;
                        setEditedState({
                          ...editedState,
                          theme: newTheme,
                          weather: updatedWeather,
                        });
                      }}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        (editedState.theme || "day") === themeOpt.id
                          ? "border-[#EA580C] bg-[#FFF2E8] shadow-[0_2px_0_#EA580C]"
                          : "border-[#4E2512] bg-white hover:bg-[#FAF4E9] shadow-[0_2px_0_#4E2512]"
                      }`}
                    >
                      <div className="font-serif font-black text-xs text-[#4E2512]">
                        {themeOpt.label}
                      </div>
                      <div className="text-[9px] text-[#4E2512]/70 mt-0.5 leading-tight">
                        {themeOpt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SELECT AMBIENT WEATHER */}
              <h3 className="font-display font-black text-sm text-[#EA580C] uppercase tracking-wider mt-6 pt-4 border-t-2 border-[#4E2512]/10">
                🪄 SELECT AMBIENT WEATHER
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-serif font-black text-[#4E2512] uppercase tracking-wider">
                  Magical Weather Effect
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "none", label: "🚫 Clear Sky", desc: "No magical effects" },
                    { id: "petals", label: "🌸 Falling Petals", desc: "Cozy rose & blossom petals" },
                    { id: "sparkles", label: "✨ Floating Sparkles", desc: "Glittering golden sparkles" },
                    { id: "snow", label: "❄️ Light Snow", desc: "Gentle magical snow" },
                    { id: "rain", label: "🌧️ Romantic Rain", desc: "Cozy magical drizzle" },
                    {
                      id: "fireflies",
                      label: "🧚 Fireflies 🌙",
                      desc: "Glowing fireflies (Night only)",
                      disabled: (editedState.theme || "day") !== "night"
                    },
                  ].map((weatherOpt) => (
                    <button
                      key={weatherOpt.id}
                      type="button"
                      disabled={weatherOpt.disabled}
                      onClick={() =>
                        setEditedState({
                          ...editedState,
                          weather: weatherOpt.id as any,
                        })
                      }
                      className={`p-2 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        weatherOpt.disabled
                          ? "opacity-40 border-gray-300 bg-gray-100 cursor-not-allowed"
                          : (editedState.weather || "none") === weatherOpt.id
                          ? "border-[#EA580C] bg-[#FFF2E8] shadow-[0_2px_0_#EA580C]"
                          : "border-[#4E2512] bg-white hover:bg-[#FAF4E9] shadow-[0_2px_0_#4E2512]"
                      }`}
                    >
                      <div className="font-serif font-black text-xs text-[#4E2512]">
                        {weatherOpt.label}
                      </div>
                      <div className="text-[9px] text-[#4E2512]/70 mt-0.5 leading-tight">
                        {weatherOpt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* TAB: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              {editedState.timeline.map((item, idx) => (
                <div key={idx} className="border border-gold/20 rounded-xl p-3 relative bg-winedeep/10">
                  <button
                    onClick={() => {
                      const updated = { ...editedState };
                      updated.timeline.splice(idx, 1);
                      setEditedState(updated);
                    }}
                    className="absolute top-2 right-2 text-rose-300 hover:text-rose-400 font-bold p-1 cursor-pointer"
                    title="Delete milestone"
                  >
                    ✕
                  </button>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1 space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-blush">
                          Emoji
                        </label>
                        <input
                          type="text"
                          value={item.emoji}
                          onChange={(e) => {
                            const updated = { ...editedState };
                            updated.timeline[idx].emoji = e.target.value;
                            setEditedState(updated);
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-white/5 text-center text-sm focus:outline-none focus:border-gold-light"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-blush">
                          Date label
                        </label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => {
                            const updated = { ...editedState };
                            updated.timeline[idx].date = e.target.value;
                            setEditedState(updated);
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-white/5 text-sm focus:outline-none focus:border-gold-light"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-blush">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = { ...editedState };
                          updated.timeline[idx].title = e.target.value;
                          setEditedState(updated);
                        }}
                        className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-white/5 text-sm focus:outline-none focus:border-gold-light"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-blush">
                        Story
                      </label>
                      <textarea
                        value={item.text}
                        onChange={(e) => {
                          const updated = { ...editedState };
                          updated.timeline[idx].text = e.target.value;
                          setEditedState(updated);
                        }}
                        rows={2}
                        className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-white/5 text-sm focus:outline-none focus:border-gold-light resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                disabled={editedState.timeline.length >= 8}
                onClick={() => {
                  if (editedState.timeline.length >= 8) {
                    alert("Maximum of 8 milestones reached.");
                    return;
                  }
                  const updated = { ...editedState };
                  updated.timeline.push({
                    emoji: "💖",
                    date: "New milestone",
                    title: "Untitled Moment",
                    text: "Write your beautiful memory here.",
                  });
                  setEditedState(updated);
                }}
                className={`w-full border border-dashed py-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                  editedState.timeline.length >= 8
                    ? "border-gold/20 bg-gold/5 text-gold-light/40 cursor-not-allowed opacity-60"
                    : "border-gold/40 hover:border-gold-light/60 text-gold-light hover:text-white cursor-pointer"
                }`}
              >
                + Add New Milestone
              </button>
              {editedState.timeline.length >= 8 && (
                <p className="text-[10px] text-amber-600/90 text-center font-serif font-black uppercase tracking-wider animate-pulse">
                  ⚠️ Maximum of 8 milestones reached.
                </p>
              )}
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              {/* Entrance Hub Photos Section */}
              <div className="space-y-4">
                <h3 className="font-display font-black text-sm text-[#EA580C] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#4E2512]/10 pb-1">
                  🚪 Entrance Hub Photos
                </h3>
                <p className="text-[10px] text-blush opacity-80 leading-relaxed bg-gold/5 p-3 rounded-lg border border-gold/20">
                  The photos uploaded here will automatically frame your Main Hub Carousel display. Note: Only image files are allowed for the Carousel.
                </p>
                {editedState.gallery.map((item, idx) => (
                  <div key={idx} className="border border-gold/20 rounded-xl p-3 relative bg-winedeep/10 space-y-3">
                    <button
                      onClick={() => {
                        const itemToDelete = editedState.gallery[idx];
                        if (itemToDelete && itemToDelete.media) {
                          deleteFileFromSupabase(itemToDelete.media);
                        }
                        const updated = { ...editedState };
                        updated.gallery.splice(idx, 1);
                        setEditedState(updated);
                      }}
                      className="absolute top-2 right-2 text-rose-300 hover:text-rose-400 font-bold p-1 cursor-pointer"
                      title="Delete item"
                    >
                      ✕
                    </button>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-blush">
                        Caption
                      </label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => {
                          const updated = { ...editedState };
                          updated.gallery[idx].caption = e.target.value;
                          setEditedState(updated);
                        }}
                        className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-white/5 text-sm focus:outline-none focus:border-gold-light"
                      />
                    </div>
                    {item.media ? (
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-wider text-blush block">
                          Current Media Asset
                        </label>
                        <div className="flex items-center gap-3 bg-gold/5 p-2 rounded-lg border border-gold/20">
                          {/* Thumbnail Preview */}
                          <div className="relative w-12 h-12 bg-black/20 rounded-md overflow-hidden flex items-center justify-center shrink-0 border border-gold/30">
                            {item.mediaType === "video" ? (
                              <video
                                src={item.media}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                autoPlay
                                loop
                              />
                            ) : (
                              <img
                                src={item.media}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            {item.mediaType === "video" && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-[8px] text-white px-1 rounded-sm font-bold uppercase">
                                video
                              </span>
                            )}
                          </div>

                          {/* File details & Actions */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-mono text-gold-light truncate" title={item.fileName || "Uploaded Media"}>
                              {item.fileName || `loaded_asset_${idx + 1}.${item.mediaType === "video" ? "mp4" : "png"}`}
                            </p>
                            <p className="text-[9px] text-blush/60 capitalize">
                              {item.mediaType} asset
                            </p>
                          </div>

                          {/* Clear button */}
                          <button
                            onClick={() => {
                              const itemToClear = editedState.gallery[idx];
                              if (itemToClear && itemToClear.media) {
                                deleteFileFromSupabase(itemToClear.media);
                              }
                              const updated = { ...editedState };
                              updated.gallery[idx].media = "";
                              updated.gallery[idx].fileName = undefined;
                              setEditedState(updated);
                            }}
                            className="p-1.5 bg-rose-900/30 hover:bg-rose-900/60 border border-rose-500/25 hover:border-rose-500/50 rounded-lg text-rose-300 transition-colors cursor-pointer flex items-center justify-center"
                            title="Remove media"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-blush">
                          Upload photo
                        </label>
                        {uploadingIndex[`gallery-${idx}`] ? (
                          <div className="text-xs text-amber-500 font-mono animate-pulse py-1 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            {uploadingIndex[`gallery-${idx}`] === "compressing" ? "Compressing asset..." : "Uploading to cloud..."}
                          </div>
                        ) : (
                          <input
                            key={`${idx}-empty`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGalleryMediaUpload(idx, file);
                            }}
                            className="w-full text-xs text-cream/70 file:mr-3 file:py-1 file:px-2.5 file:rounded-full file:border file:border-gold/30 file:text-[10px] file:bg-gold/15 file:text-gold-light file:cursor-pointer hover:file:bg-gold/35"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updated = { ...editedState };
                    updated.gallery.push({
                      caption: "A beautiful day",
                      media: "",
                      mediaType: "image",
                    });
                    setEditedState(updated);
                  }}
                  className="w-full border border-dashed border-gold/40 hover:border-gold-light/60 py-3 rounded-xl text-xs font-semibold text-gold-light hover:text-white transition-colors cursor-pointer"
                >
                  + Add Photo / Video Frame
                </button>
              </div>

              {/* Memory Log Section */}
              <div className="space-y-4 pt-4 border-t-2 border-[#4E2512]/15">
                <h3 className="font-display font-black text-sm text-[#EA580C] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#4E2512]/10 pb-1">
                  📖 Memory Log Album Photos
                </h3>
                <p className="text-[10px] text-blush opacity-80 leading-relaxed bg-gold/5 p-3 rounded-lg border border-gold/20">
                  These photos will appear inside the fairytale book Memory Album component. To ensure a clean, balanced layout, we recommend uploading photos in sets of 4 with matching aspect ratios per row (e.g., 4 Portrait photos first, followed by 4 Landscape photos). 
                </p>
                {(editedState.memoryLogGallery || []).map((item, idx) => (
                  <div key={idx} className="border border-gold/20 rounded-xl p-3 relative bg-winedeep/10 space-y-3">
                    <button
                      onClick={() => {
                        const itemToDelete = editedState.memoryLogGallery?.[idx];
                        if (itemToDelete && itemToDelete.media) {
                          deleteFileFromSupabase(itemToDelete.media);
                        }
                        const updated = { ...editedState };
                        if (!updated.memoryLogGallery) updated.memoryLogGallery = [];
                        updated.memoryLogGallery.splice(idx, 1);
                        setEditedState(updated);
                      }}
                      className="absolute top-2 right-2 text-rose-300 hover:text-rose-400 font-bold p-1 cursor-pointer"
                      title="Delete item"
                    >
                      ✕
                    </button>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-blush">
                        Caption
                      </label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => {
                          const updated = { ...editedState };
                          if (!updated.memoryLogGallery) updated.memoryLogGallery = [];
                          updated.memoryLogGallery[idx].caption = e.target.value;
                          setEditedState(updated);
                        }}
                        className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-white/5 text-sm focus:outline-none focus:border-gold-light"
                      />
                    </div>
                    {item.media ? (
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-wider text-blush block">
                          Current Media Asset
                        </label>
                        <div className="flex items-center gap-3 bg-gold/5 p-2 rounded-lg border border-gold/20">
                          {/* Thumbnail Preview */}
                          <div className="relative w-12 h-12 bg-black/20 rounded-md overflow-hidden flex items-center justify-center shrink-0 border border-gold/30">
                            {item.mediaType === "video" ? (
                              <video
                                src={item.media}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                autoPlay
                                loop
                              />
                            ) : (
                              <img
                                src={item.media}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            {item.mediaType === "video" && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-[8px] text-white px-1 rounded-sm font-bold uppercase">
                                video
                              </span>
                            )}
                          </div>

                          {/* File details & Actions */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-mono text-gold-light truncate" title={item.fileName || "Uploaded Media"}>
                              {item.fileName || `loaded_asset_${idx + 1}.${item.mediaType === "video" ? "mp4" : "png"}`}
                            </p>
                            <p className="text-[9px] text-blush/60 capitalize">
                              {item.mediaType} asset
                            </p>
                          </div>

                          {/* Clear button */}
                          <button
                            onClick={() => {
                              const itemToClear = editedState.memoryLogGallery?.[idx];
                              if (itemToClear && itemToClear.media) {
                                deleteFileFromSupabase(itemToClear.media);
                              }
                              const updated = { ...editedState };
                              if (updated.memoryLogGallery) {
                                updated.memoryLogGallery[idx].media = "";
                                updated.memoryLogGallery[idx].fileName = undefined;
                                setEditedState(updated);
                              }
                            }}
                            className="p-1.5 bg-rose-900/30 hover:bg-rose-900/60 border border-rose-500/25 hover:border-rose-500/50 rounded-lg text-rose-300 transition-colors cursor-pointer flex items-center justify-center"
                            title="Remove media"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-blush">
                          Upload photo or video
                        </label>
                        {uploadingIndex[`memory-${idx}`] ? (
                          <div className="text-xs text-amber-500 font-mono animate-pulse py-1 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            {uploadingIndex[`memory-${idx}`] === "compressing" ? "Compressing asset..." : "Uploading to cloud..."}
                          </div>
                        ) : (
                          <input
                            key={`${idx}-empty`}
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleMemoryLogMediaUpload(idx, file);
                            }}
                            className="w-full text-xs text-cream/70 file:mr-3 file:py-1 file:px-2.5 file:rounded-full file:border file:border-gold/30 file:text-[10px] file:bg-gold/15 file:text-gold-light file:cursor-pointer hover:file:bg-gold/35"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    const currentPhotos = (editedState.memoryLogGallery || []).filter(
                      (item) => item.media && item.mediaType === "image"
                    ).length;
                    const currentVideos = (editedState.memoryLogGallery || []).filter(
                      (item) => item.media && item.mediaType === "video"
                    ).length;

                    if (currentPhotos >= 40 && currentVideos >= 6) {
                      alert("Maximum file limit reached for this album section.");
                      return;
                    }

                    const updated = { ...editedState };
                    if (!updated.memoryLogGallery) {
                      updated.memoryLogGallery = [];
                    }
                    updated.memoryLogGallery.push({
                      caption: "A sweet album memory",
                      media: "",
                      mediaType: "image",
                    });
                    setEditedState(updated);
                  }}
                  className="w-full border border-dashed border-gold/40 hover:border-gold-light/60 py-3 rounded-xl text-xs font-semibold text-gold-light hover:text-white transition-colors cursor-pointer"
                >
                  + Add Album Photo / Video Frame
                </button>
              </div>
            </div>
          )}

          {/* TAB: REASONS */}
          {activeTab === "reasons" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-xs text-orange-600 uppercase tracking-wider">
                    💖 Affection Deck Reasons
                  </h3>
                  <p className="text-[10px] text-[#4E2512]/70 leading-relaxed font-serif mt-1">
                    Add or modify the reasons why you love them. Each reason will be displayed as a card on the main view.
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {editedState.reasons.map((reason, index) => (
                  <div key={index} className="border border-gold/20 rounded-xl p-3 relative bg-winedeep/5 space-y-2 group shadow-sm transition-all hover:border-gold/35">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-mono font-bold text-orange-600/80">
                        Reason #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditedState((prev) => {
                            if (!prev) return prev;
                            const updated = { ...prev };
                            const updatedReasons = [...updated.reasons];
                            updatedReasons.splice(index, 1);
                            return { ...updated, reasons: updatedReasons };
                          });
                        }}
                        className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-colors cursor-pointer"
                        title="Delete Reason"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      value={reason}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditedState((prev) => {
                          if (!prev) return prev;
                          const updated = { ...prev };
                          const updatedReasons = [...updated.reasons];
                          updatedReasons[index] = val;
                          return { ...updated, reasons: updatedReasons };
                        });
                      }}
                      rows={3}
                      placeholder="Because of..."
                      className="w-full px-3 py-2 rounded-lg border border-gold/25 bg-white/40 text-[#4E2512] text-xs focus:outline-none focus:border-gold-light focus:ring-1 focus:ring-gold-light resize-none font-medium leading-relaxed"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditedState((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      reasons: [...prev.reasons, ""],
                    };
                  });
                }}
                className="w-full border-2 border-dashed border-[#EA580C]/40 hover:border-[#EA580C]/80 py-2.5 rounded-xl text-xs font-serif font-black text-[#EA580C] hover:bg-white/40 transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                + Add New Reason
              </button>
            </div>
          )}

          {/* TAB: QUIZ */}
          {activeTab === "quiz" && (
            <div className="space-y-4">
              {editedState.quiz.map((item, idx) => (
                <div key={idx} className="border border-gold/20 rounded-xl p-3 relative bg-winedeep/10 space-y-2">
                  <button
                    onClick={() => {
                      const updated = { ...editedState };
                      updated.quiz.splice(idx, 1);
                      setEditedState(updated);
                    }}
                    className="absolute top-2 right-2 text-rose-300 hover:text-rose-400 font-bold p-1 cursor-pointer"
                    title="Delete question"
                  >
                    ✕
                  </button>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-blush">
                      Question {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={item.q}
                      onChange={(e) => {
                        const updated = { ...editedState };
                        updated.quiz[idx].q = e.target.value;
                        setEditedState(updated);
                      }}
                      className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-white/5 text-sm focus:outline-none focus:border-gold-light"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {item.options.map((opt, optIdx) => (
                      <div key={optIdx} className="space-y-0.5">
                        <label className="text-[8px] uppercase text-blush/80">
                          Option {optIdx + 1} {optIdx === item.correct ? "⭐" : ""}
                        </label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = { ...editedState };
                            updated.quiz[idx].options[optIdx] = e.target.value;
                            setEditedState(updated);
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-gold/20 bg-white/5 text-xs focus:outline-none focus:border-gold"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-blush">
                      Correct option index (1-4)
                    </label>
                    <select
                      value={item.correct + 1}
                      onChange={(e) => {
                        const updated = { ...editedState };
                        updated.quiz[idx].correct = parseInt(e.target.value, 10) - 1;
                        setEditedState(updated);
                      }}
                      className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-winedeep/80 text-cream text-xs focus:outline-none focus:border-gold-light"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const updated = { ...editedState };
                  updated.quiz.push({
                    q: "New relationship question?",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correct: 0,
                  });
                  setEditedState(updated);
                }}
                className="w-full border border-dashed border-gold/40 hover:border-gold-light/60 py-3 rounded-xl text-xs font-semibold text-gold-light hover:text-white transition-colors cursor-pointer"
              >
                + Add Question
              </button>
            </div>
          )}

          {/* TAB: VOICE */}
          {activeTab === "voice" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-blush block font-bold">
                  PASTE YOUTUBE VIDEO URL
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editedState.youtubeUrl || ""}
                  onChange={(e) =>
                    setEditedState({ ...editedState, youtubeUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-white/5 text-cream text-sm focus:outline-none focus:border-gold-light"
                />
                <p className="text-[9px] text-blush/80 leading-normal">
                  Accepts full links, mobile links (youtu.be), or raw 11-char Video IDs.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-blush block font-bold">
                  Player Visual Option
                </label>
                <select
                  value={editedState.hidePlayerVisuals ? "true" : "false"}
                  onChange={(e) =>
                    setEditedState({
                      ...editedState,
                      hidePlayerVisuals: e.target.value === "true",
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-gold/30 bg-winedeep text-cream text-xs focus:outline-none focus:border-gold-light"
                >
                  <option value="false">📺 Show Music Video Frame</option>
                  <option value="true">🎵 Hide Player Visuals (Background Music)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-blush">
                  Track Label
                </label>
                <input
                  type="text"
                  value={editedState.audioName}
                  onChange={(e) =>
                    setEditedState({ ...editedState, audioName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-white/5 text-cream text-sm focus:outline-none focus:border-gold-light"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-blush">
                  Note above play button
                </label>
                <input
                  type="text"
                  value={editedState.voiceNote}
                  onChange={(e) =>
                    setEditedState({ ...editedState, voiceNote: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-white/5 text-cream text-sm focus:outline-none focus:border-gold-light"
                />
              </div>
            </div>
          )}

          {/* TAB: FINALE */}
          {activeTab === "finale" && (
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-wider text-blush">
                Final Letter / Heartfelt Message
              </label>
              <textarea
                value={editedState.finaleMessage}
                onChange={(e) =>
                  setEditedState({ ...editedState, finaleMessage: e.target.value })
                }
                rows={11}
                placeholder="To my favorite person..."
                className="w-full px-3 py-2.5 rounded-lg border border-gold/30 bg-white/5 text-cream text-sm focus:outline-none focus:border-gold-light resize-none"
              />
            </div>
          )}

          {/* TAB: SHARE */}
          {activeTab === "share" && clientId && (
            <div className="space-y-4">
              <h3 className="font-display font-black text-sm text-[#EA580C] uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#EC4899]" />
                Direct Live Link
              </h3>
              <p className="text-xs font-serif font-bold text-[#4E2512]/80 leading-relaxed bg-[#FAF4E9] p-3 rounded-xl border border-[#4E2512]/10">
                Generate and share a direct link with your special someone.
                Opening this link bypasses the login screen completely and loads your beautiful, customized love story directly starting at the door screen! 🚪✨
              </p>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-serif font-black tracking-wider text-[#4E2512]/70">
                  Your Public URL
                </label>
                <div className="flex flex-col gap-2">
                  <div className="w-full px-3 py-2.5 rounded-xl border-2 border-[#4E2512] bg-white font-mono text-[10px] break-all select-all text-[#4E2512]">
                    {`${window.location.origin}${window.location.pathname}?space=${clientId}`}
                  </div>

                  <button
                    onClick={() => {
                      const liveUrl = `${window.location.origin}${window.location.pathname}?space=${clientId}`;
                      navigator.clipboard.writeText(liveUrl).then(() => {
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      });
                    }}
                    className="w-full bg-[#EC4899] hover:bg-[#DB2777] text-white font-serif font-black text-xs py-2 rounded-xl border-2 border-[#4E2512] shadow-[0_2.5px_0_#4E2512] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Live Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t-2 border-[#4E2512] flex-shrink-0 bg-[#FAF4E9] flex flex-col gap-2.5">
          <button
            onClick={handleSave}
            className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-serif font-black text-sm py-2.5 rounded-xl border-2 border-[#4E2512] shadow-[0_3px_0_#4E2512] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase tracking-wider"
          >
            💾 Save Changes 💾
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-serif font-black text-xs py-2.5 rounded-xl border-2 border-[#4E2512] shadow-[0_3px_0_#4E2512] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase tracking-wider"
            >
              Log Out
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full text-xs font-serif font-black text-[#EF4444] hover:text-[#DC2626] transition-colors cursor-pointer pt-1 text-center"
          >
            ✕ Close Settings
          </button>
        </div>
      </div>
    </>
  );
}

