import React, { useEffect, useState } from "react";
import { LoveStoryState, ClientAccount, UserSession } from "./types";
import { initialStoryState } from "./constants";
import {
  fetchClientsFromSupabase,
  syncClientToSupabase,
  deleteClientFromSupabase,
  getFriendlyDbError,
} from "./supabase";

// Import Components
import Atmosphere from "./components/Atmosphere";
import AmbientWeather from "./components/AmbientWeather";
import Gate from "./components/Gate";
import TopNav from "./components/TopNav";
import Hub from "./components/Hub";
import Timeline from "./components/Timeline";
import Gallery from "./components/Gallery";
import Countdown from "./components/Countdown";
import Reasons from "./components/Reasons";
import Quiz from "./components/Quiz";
import Voice from "./components/Voice";
import Finale from "./components/Finale";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import MasterAdmin from "./components/MasterAdmin";

const CLIENTS_DB_KEY = "fairy_clients_list_v2";
const SESSION_KEY = "fairy_user_session_v2";

function getYouTubeId(url: string): string {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  const trimmed = url.trim();
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".")) {
    return trimmed;
  }
  return "";
}

export default function App() {
  // 1. Clients Database
  const [clients, setClients] = useState<ClientAccount[]>(() => {
    try {
      const raw = localStorage.getItem(CLIENTS_DB_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to load clients database", e);
    }
    // Seed default sample clients
    const seeds: ClientAccount[] = [
      {
        id: "sample-space",
        username: "love_story",
        password: "password",
        spaceState: { ...initialStoryState },
        createdAt: new Date().toISOString(),
      },
    ];
    try {
      localStorage.setItem(CLIENTS_DB_KEY, JSON.stringify(seeds));
    } catch (e) {
      console.warn("Failed to seed clients database", e);
    }
    return seeds;
  });

  // 2. Active Session state
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    }
    return null;
  });

  // Fetch clients from Supabase on startup
  useEffect(() => {
    async function loadSupabaseClients() {
      try {
        const supabaseClients = await fetchClientsFromSupabase();
        if (supabaseClients && supabaseClients.length > 0) {
          setClients(supabaseClients);
          localStorage.setItem(CLIENTS_DB_KEY, JSON.stringify(supabaseClients));
        }
      } catch (e) {
        console.warn("Failed to fetch clients from Supabase. Using localStorage/seeded clients.", e);
      }
    }
    loadSupabaseClients();
  }, []);

  // 3. Routing & Live Link state
  const urlParams = new URLSearchParams(window.location.search);
  const spaceParam = urlParams.get("space") || urlParams.get("view") || urlParams.get("gift");
  const isLiveView = !!spaceParam;

  // 4. Current viewed LoveStoryState
  const [state, setState] = useState<LoveStoryState>(() => {
    if (isLiveView) {
      const found = clients.find((c) => c.id === spaceParam);
      if (found) {
        return found.spaceState;
      }
    } else if (session && session.role === "client") {
      const found = clients.find((c) => c.id === session.clientId);
      if (found) {
        return found.spaceState;
      }
    }
    return initialStoryState;
  });

  // Keep state in sync if clients list, spaceParam or session changes
  useEffect(() => {
    if (isLiveView) {
      const found = clients.find((c) => c.id === spaceParam);
      if (found) {
        setState(found.spaceState);
      }
    } else if (session && session.role === "client") {
      const found = clients.find((c) => c.id === session.clientId);
      if (found) {
        setState(found.spaceState);
      }
    } else {
      setState(initialStoryState);
    }
  }, [clients, session, spaceParam, isLiveView]);

  // Navigation and Gate opening state
  const [activeRoom, setActiveRoom] = useState<string>("gate");
  const [gateOpened, setGateOpened] = useState(false);
  const [recedingFlash, setRecedingFlash] = useState(false);

  // Auto-reset the global receding cinematic flash overlay
  useEffect(() => {
    if (recedingFlash) {
      const timer = setTimeout(() => {
        setRecedingFlash(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [recedingFlash]);

  // YouTube player state & position sync
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [isYtPlaying, setIsYtPlaying] = useState(false);
  const [placeholderRect, setPlaceholderRect] = useState<DOMRect | null>(null);

  // Parse video ID from url
  const parsedVideoId = getYouTubeId(state?.youtubeUrl || "");

  // 1. Inject YT API Script
  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }, []);

  // 2. Poll for container availability & initialize player once ready
  useEffect(() => {
    let intervalId: any;

    const tryInit = () => {
      const container = document.getElementById("yt-player-container");
      const YT = (window as any).YT;

      // Only initialize if container exists, YT library is ready, and player hasn't been instantiated yet
      if (container && YT && YT.Player && !ytPlayer) {
        clearInterval(intervalId);
        try {
          const player = new YT.Player("yt-player-container", {
            height: "100%",
            width: "100%",
            videoId: parsedVideoId || "",
            playerVars: {
              autoplay: 0,
              controls: 1,
              rel: 0,
              showinfo: 0,
              modestbranding: 1,
              playsinline: 1,
              enablejsapi: 1,
            },
            events: {
              onReady: (event: any) => {
                setYtPlayer(event.target);
              },
              onStateChange: (event: any) => {
                if (event.data === 1) {
                  setIsYtPlaying(true);
                } else {
                  setIsYtPlaying(false);
                }
                // Infinite Loop: loop back to start when video finishes playing
                if (event.data === 0) {
                  if (event.target && typeof event.target.seekTo === "function") {
                    event.target.seekTo(0);
                  }
                  if (event.target && typeof event.target.playVideo === "function") {
                    event.target.playVideo();
                  }
                }
              },
            },
          });
        } catch (err) {
          console.error("Failed to init YT player", err);
        }
      }
    };

    const prevCallback = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      tryInit();
    };

    intervalId = setInterval(tryInit, 200);
    tryInit();

    return () => {
      clearInterval(intervalId);
    };
  }, [session, isLiveView, ytPlayer, parsedVideoId]);

  // Sync state & load new video ID when parsedVideoId changes
  useEffect(() => {
    if (ytPlayer && parsedVideoId) {
      try {
        const currentId = ytPlayer.getVideoData?.()?.video_id;
        if (currentId !== parsedVideoId) {
          if (gateOpened) {
            if (typeof ytPlayer.loadVideoById === "function") {
              ytPlayer.loadVideoById({ videoId: parsedVideoId });
            }
            if (typeof ytPlayer.playVideo === "function") {
              ytPlayer.playVideo();
            }
          } else {
            if (typeof ytPlayer.cueVideoById === "function") {
              ytPlayer.cueVideoById({ videoId: parsedVideoId });
            }
          }
        }
      } catch (e) {
        console.warn("YT sync error", e);
      }
    }
  }, [ytPlayer, parsedVideoId, gateOpened]);

  // Handle immediate play when door is clicked
  const handleStartPlay = () => {
    if (ytPlayer) {
      try {
        if (typeof ytPlayer.unMute === "function") {
          ytPlayer.unMute();
        }
        if (typeof ytPlayer.playVideo === "function") {
          ytPlayer.playVideo();
        }
      } catch (e) {
        console.warn("Failed to autoplay on direct user click", e);
      }
    }
  };

  // Track position of yt placeholder element in Voice page
  useEffect(() => {
    if (activeRoom !== "voice" || state.hidePlayerVisuals) {
      setPlaceholderRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.getElementById("yt-placeholder");
      if (el) {
        setPlaceholderRect(el.getBoundingClientRect());
      } else {
        setPlaceholderRect(null);
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 150);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [activeRoom, state.hidePlayerVisuals]);

  // Handle Play/Pause Toggle
  const handleTogglePlay = () => {
    if (!ytPlayer) return;
    try {
      if (isYtPlaying) {
        ytPlayer.pauseVideo();
      } else {
        ytPlayer.playVideo();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Control Panel open states
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Handle Save State (Client Space Edits)
  const handleSaveState = async (updatedState: LoveStoryState) => {
    setState(updatedState);

    // Determine target client account to save to
    let targetId = session?.role === "client" ? session.clientId : spaceParam;
    let clientToUpdate = clients.find((c) => c.id === targetId);

    // Safe fallback if targetId is missing or client is not found: update the first available client space
    if (!clientToUpdate && clients.length > 0) {
      clientToUpdate = clients[0];
      targetId = clientToUpdate.id;
    }

    if (clientToUpdate && targetId) {
      const updatedClient = { ...clientToUpdate, spaceState: updatedState };
      const updatedClients = clients.map((c) => {
        if (c.id === targetId) {
          return updatedClient;
        }
        return c;
      });
      setClients(updatedClients);

      // Save locally as immediate fallback
      try {
        localStorage.setItem(CLIENTS_DB_KEY, JSON.stringify(updatedClients));
      } catch (e: any) {
        console.warn("localStorage quota limit reached while saving client states", e);
      }

      // Sync to Supabase database
      try {
        await syncClientToSupabase(updatedClient);
      } catch (err: any) {
        console.error("Failed to sync client state to Supabase database:", err);
        alert(getFriendlyDbError(err));
      }
    }
  };

  // Create Client (Creator Action)
  const handleCreateClient = async (username: string, password: string) => {
    const newClient: ClientAccount = {
      id: "client-" + Math.random().toString(36).substr(2, 9),
      username,
      password,
      spaceState: { ...initialStoryState, hubTitle: "OurFairyLoveStory", gateTitle: "A Gift For You", gateSub: "Open when ready" },
      createdAt: new Date().toISOString(),
    };
    const updated = [...clients, newClient];
    setClients(updated);

    // Save locally as a fallback
    try {
      localStorage.setItem(CLIENTS_DB_KEY, JSON.stringify(updated));
    } catch (e: any) {
      console.warn("localStorage quota limit reached while creating client", e);
    }

    // Sync to Supabase database
    try {
      await syncClientToSupabase(newClient);
    } catch (err: any) {
      console.error("Failed to sync new client to Supabase database:", err);
      alert(getFriendlyDbError(err));
    }
  };

  // Delete Client (Creator Action)
  const handleDeleteClient = async (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);

    // Save locally as fallback
    try {
      localStorage.setItem(CLIENTS_DB_KEY, JSON.stringify(updated));
    } catch (e: any) {
      console.warn("Failed to delete client from local storage", e);
    }

    // Sync deletion to Supabase database
    try {
      await deleteClientFromSupabase(id);
    } catch (err: any) {
      console.error("Failed to delete client from Supabase database:", err);
      alert(getFriendlyDbError(err));
    }
  };

  // Update client landing page welcome configuration
  const handleUpdateClientWelcome = async (clientId: string, gateTitle: string, gateSub: string, hubTitle: string) => {
    const clientToUpdate = clients.find((c) => c.id === clientId);
    if (!clientToUpdate) return;

    const updatedClient = {
      ...clientToUpdate,
      spaceState: {
        ...clientToUpdate.spaceState,
        gateTitle,
        gateSub,
        hubTitle,
      }
    };

    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return updatedClient;
      }
      return c;
    });
    setClients(updated);

    // Save locally as fallback
    try {
      localStorage.setItem(CLIENTS_DB_KEY, JSON.stringify(updated));
    } catch (e: any) {
      console.warn("localStorage quota limit reached while updating welcome page", e);
    }

    // Sync updated welcome settings to Supabase
    try {
      await syncClientToSupabase(updatedClient);
    } catch (err: any) {
      console.error("Failed to sync welcome changes to Supabase database:", err);
      alert(getFriendlyDbError(err));
    }
  };

  // Handle login success
  const handleLoginSuccess = (role: "creator" | "client", username: string, clientId?: string) => {
    const newSession: UserSession = { role, username, clientId };
    setSession(newSession);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    } catch (e) {
      console.error("Failed to save user session to localStorage", e);
    }

    // Reset navigation for fresh session
    setGateOpened(false);
    setActiveRoom("gate");
  };

  // Handle logout
  const handleLogout = () => {
    setSession(null);
    setYtPlayer(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error("Failed to clear session", e);
    }
    // Reset view states
    setGateOpened(false);
    setActiveRoom("gate");
    setShowAdminPanel(false);

    // Redirect to login page to clear any view/space/gift URL params
    window.location.href = window.location.origin + window.location.pathname;
  };

  // Impersonate / view client space as Creator
  const handleImpersonateClient = (clientId: string) => {
    const targetClient = clients.find((c) => c.id === clientId);
    const fakeSession: UserSession = {
      role: "client",
      username: targetClient?.username || "client",
      clientId,
    };
    setSession(fakeSession);
    setGateOpened(false);
    setActiveRoom("gate");
  };

  // Handle navigating between chapters / screens
  const handleNavigate = (room: string) => {
    setActiveRoom(room);
  };

  // Handle opening the initial gate
  const handleOpenGate = () => {
    setGateOpened(true);
    handleNavigate("hub");
    setRecedingFlash(true);
    if (ytPlayer && parsedVideoId) {
      try {
        ytPlayer.playVideo();
      } catch (e) {
        console.warn("Could not autoplay on gate open", e);
      }
    }
  };

  // --- RENDER ROUTING ENGINE ---

  // 1. Direct Live Link (Public Spectator View) - Completely bypasses Login Screen
  if (isLiveView) {
    const targetClient = clients.find((c) => c.id === spaceParam);
    if (!targetClient) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-rose-100 to-amber-50 text-center select-none font-sans">
          <span className="text-5xl mb-4 animate-bounce">🔮</span>
          <h1 className="font-display font-black text-2xl text-[#EA580C] mb-2">Space Not Found</h1>
          <p className="text-sm font-serif text-[#4E2512] max-w-sm leading-relaxed mb-6">
            The magical direct link you opened seems to have expired or does not exist. Please ask your special person for an updated link!
          </p>
          <a
            href={window.location.origin + window.location.pathname}
            className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] border-2 border-[#4E2512] text-white rounded-xl shadow-[0_3px_0_#4E2512] font-serif font-black text-xs cursor-pointer active:translate-y-0.5 active:shadow-none"
          >
            Go to Login Portal
          </a>
        </div>
      );
    }

    const showAdminButton = !!(
      session &&
      (session.role === "creator" || (session.role === "client" && session.clientId === spaceParam))
    );

    return (
      <div className={`relative w-screen h-screen overflow-hidden transition-colors duration-500 ${state.theme === "night" ? "bg-[#090D1A]" : "bg-[#FFF0F3]"}`}>
        <Atmosphere theme={state.theme} />
        <TopNav
          hubTitle="OurFairyLoveStory"
          activeRoom={activeRoom}
          visible={gateOpened && activeRoom !== "gate"}
          onNavigate={handleNavigate}
          onAdminClick={() => setShowAdminPanel(true)}
          showAdminButton={showAdminButton}
          theme={state.theme}
        />
        <div
          className={`relative w-full h-full z-10 select-text ${state.theme === "night" ? "theme-night" : "theme-day"}`}
          style={
            activeRoom !== "gate"
              ? {
                  backgroundImage: state.theme === "night"
                    ? "url('https://i.ibb.co/WpfkW436/backgroundwebsitenighttheme.png')"
                    : "url('https://i.ibb.co/217j1FGr/backgrounwebsite.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center bottom",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed",
                  imageRendering: "crisp-edges",
                  WebkitImageRendering: "-webkit-optimize-contrast",
                } as React.CSSProperties
              : undefined
          }
        >
          {/* Global Ambient Weather overlay for all rooms except Gate */}
          {activeRoom !== "gate" && (
            <div className="absolute inset-0 pointer-events-none z-30">
              <AmbientWeather weather={state.weather} theme={state.theme} />
            </div>
          )}
          {activeRoom === "gate" && !gateOpened && (
            <div key="gate-screen" className="absolute inset-0">
              <Gate
                gateTitle="A Gift For You"
                gateSub="Open when ready"
                onOpen={handleOpenGate}
                onStartPlay={handleStartPlay}
              />
            </div>
          )}
          {activeRoom === "hub" && (
            <div key="hub-screen" className="absolute inset-0">
              <Hub
                hubTitle="OurFairyLoveStory"
                gallery={state.gallery}
                onNavigate={handleNavigate}
                frameStyle={state.frameStyle}
                theme={state.theme}
                weather={state.weather}
              />
            </div>
          )}
          {activeRoom === "timeline" && (
            <div key="timeline-screen" className="absolute inset-0">
              <Timeline timeline={state.timeline} theme={state.theme} />
            </div>
          )}
          {activeRoom === "gallery" && (
            <div key="gallery-screen" className="absolute inset-0">
              <Gallery gallery={state.memoryLogGallery || []} theme={state.theme} />
            </div>
          )}
          {activeRoom === "countdown" && (
            <div key="countdown-screen" className="absolute inset-0">
              <Countdown
                countdownTitle={state.countdownTitle}
                countdownDate={state.countdownDate}
                countdownSub={state.countdownSub}
              />
            </div>
          )}
          {activeRoom === "reasons" && (
            <div key="reasons-screen" className="absolute inset-0">
              <Reasons reasons={state.reasons} theme={state.theme} />
            </div>
          )}
          {activeRoom === "quiz" && (
            <div key="quiz-screen" className="absolute inset-0">
              <Quiz quiz={state.quiz} theme={state.theme} />
            </div>
          )}
          {activeRoom === "voice" && (
            <div key="voice-screen" className="absolute inset-0">
              <Voice
                voiceNote={state.voiceNote}
                audioName={state.audioName}
                youtubeUrl={state.youtubeUrl || ""}
                hidePlayerVisuals={!!state.hidePlayerVisuals}
                isPlaying={isYtPlaying}
                onTogglePlay={handleTogglePlay}
              />
            </div>
          )}
          {activeRoom === "finale" && (
            <div key="finale-screen" className="absolute inset-0">
              <Finale finaleMessage={state.finaleMessage} theme={state.theme} />
            </div>
          )}
        </div>

        {/* 📺 Persistent Global YouTube Player Container */}
        <div
          id="yt-player-wrapper"
          style={
            placeholderRect
              ? {
                  position: "fixed",
                  top: placeholderRect.top,
                  left: placeholderRect.left,
                  width: placeholderRect.width,
                  height: placeholderRect.height,
                  zIndex: 30,
                  pointerEvents: "auto",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  opacity: 1,
                }
              : {
                  position: "fixed",
                  top: "-9999px",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  zIndex: -10,
                  pointerEvents: "none",
                  opacity: 0,
                }
          }
          className="rounded-xl overflow-hidden bg-black shadow-lg"
        >
          <div id="yt-player-container" className="w-full h-full" />
        </div>

        {/* Receding Cinematic Flash Overlay */}
        {recedingFlash && (
          <div 
            className="fixed inset-0 bg-white pointer-events-none z-[99999]"
            style={{
              animation: "flashRecede 1200ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
          />
        )}

        <style>{`
          @keyframes flashRecede {
            0% {
              opacity: 1;
              background-color: #ffffff;
              filter: brightness(1.5);
            }
            30% {
              opacity: 1;
              background-color: #fef3c7; /* warm golden-white medieval tint */
            }
            100% {
              opacity: 0;
              background-color: #ffffff;
            }
          }
        `}</style>

        {/* 🔐 CLIENT ADMIN CONTROL PANEL */}
        {showAdminPanel && showAdminButton && (
          <AdminPanel
            state={state}
            onSave={handleSaveState}
            onClose={() => {
              setShowAdminPanel(false);
            }}
            showPasswordPrompt={false}
            onPasswordSuccess={() => {}}
            onPasswordCancel={() => {}}
            clientId={session?.clientId || spaceParam || undefined}
            onLogout={handleLogout}
          />
        )}
      </div>
    );
  }

  // 2. Unauthenticated state - Show beautiful Login Portal
  if (!session) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        clients={clients}
      />
    );
  }

  // 3. Creator Role authenticated - Show Master Admin dashboard directly
  if (session.role === "creator") {
    return (
      <MasterAdmin
        clients={clients}
        onCreateClient={handleCreateClient}
        onDeleteClient={handleDeleteClient}
        onLogout={handleLogout}
        onImpersonateClient={handleImpersonateClient}
        onUpdateClientWelcome={handleUpdateClientWelcome}
      />
    );
  }

  // 4. Client Role authenticated - Show full client workspace with original preserved UI
  return (
    <div className={`relative w-screen h-screen overflow-hidden transition-colors duration-500 ${state.theme === "night" ? "bg-[#090D1A]" : "bg-[#FFF0F3]"}`}>
      {/* 🌟 Celestial Animated Background */}
      <Atmosphere theme={state.theme} />

      {/* 🗺️ Glassmorphic Top Nav (Only visible after gate is opened) */}
      <TopNav
        hubTitle="OurFairyLoveStory"
        activeRoom={activeRoom}
        visible={gateOpened && activeRoom !== "gate"}
        onNavigate={handleNavigate}
        onAdminClick={() => setShowAdminPanel(true)} // Bypasses password prompt since they are logged in!
        showAdminButton={true}
        theme={state.theme}
      />

      {/* 🚪 Primary Screen Switchboard */}
      <div
        className={`relative w-full h-full z-10 select-text ${state.theme === "night" ? "theme-night" : "theme-day"}`}
        style={
          activeRoom !== "gate"
            ? {
                backgroundImage: state.theme === "night"
                  ? "url('https://i.ibb.co/WpfkW436/backgroundwebsitenighttheme.png')"
                  : "url('https://i.ibb.co/217j1FGr/backgrounwebsite.png')",
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                imageRendering: "crisp-edges",
                WebkitImageRendering: "-webkit-optimize-contrast",
              } as React.CSSProperties
            : undefined
        }
      >
        {/* Global Ambient Weather overlay for all rooms except Gate */}
        {activeRoom !== "gate" && (
          <div className="absolute inset-0 pointer-events-none z-30">
            <AmbientWeather weather={state.weather} theme={state.theme} />
          </div>
        )}
        {/* GATE SCREEN */}
        {activeRoom === "gate" && !gateOpened && (
          <div key="gate-screen" className="absolute inset-0">
            <Gate
              gateTitle="A Gift For You"
              gateSub="Open when ready"
              onOpen={handleOpenGate}
              onStartPlay={handleStartPlay}
            />
          </div>
        )}

        {/* HUB (Center Stage) */}
        {activeRoom === "hub" && (
          <div key="hub-screen" className="absolute inset-0">
            <Hub
              hubTitle="OurFairyLoveStory"
              gallery={state.gallery}
              onNavigate={handleNavigate}
              frameStyle={state.frameStyle}
              theme={state.theme}
              weather={state.weather}
            />
          </div>
        )}

        {/* CHAPTER 1: TIMELINE */}
        {activeRoom === "timeline" && (
          <div key="timeline-screen" className="absolute inset-0">
            <Timeline timeline={state.timeline} theme={state.theme} />
          </div>
        )}

        {/* CHAPTER 2: MEMORY GALLERY */}
        {activeRoom === "gallery" && (
          <div key="gallery-screen" className="absolute inset-0">
            <Gallery
              gallery={state.memoryLogGallery || []}
              theme={state.theme}
            />
          </div>
        )}

        {/* CHAPTER 3: COUNTDOWN */}
        {activeRoom === "countdown" && (
          <div key="countdown-screen" className="absolute inset-0">
            <Countdown
              countdownTitle={state.countdownTitle}
              countdownDate={state.countdownDate}
              countdownSub={state.countdownSub}
              anniversaryDate={state.anniversaryDate}
            />
          </div>
        )}

        {/* CHAPTER 4: REASONS */}
        {activeRoom === "reasons" && (
          <div key="reasons-screen" className="absolute inset-0">
            <Reasons reasons={state.reasons} theme={state.theme} />
          </div>
        )}

        {/* CHAPTER 5: QUIZ */}
        {activeRoom === "quiz" && (
          <div key="quiz-screen" className="absolute inset-0">
            <Quiz quiz={state.quiz} theme={state.theme} />
          </div>
        )}

        {/* CHAPTER 6: VOICE SONG */}
        {activeRoom === "voice" && (
          <div key="voice-screen" className="absolute inset-0">
            <Voice
              voiceNote={state.voiceNote}
              audioName={state.audioName}
              youtubeUrl={state.youtubeUrl || ""}
              hidePlayerVisuals={!!state.hidePlayerVisuals}
              isPlaying={isYtPlaying}
              onTogglePlay={handleTogglePlay}
            />
          </div>
        )}

        {/* FINAL CHAPTER: HEARTFELT MSG */}
        {activeRoom === "finale" && (
          <div key="finale-screen" className="absolute inset-0">
            <Finale finaleMessage={state.finaleMessage} theme={state.theme} />
          </div>
        )}
      </div>

      {/* 🔐 CLIENT ADMIN CONTROL PANEL */}
      {showAdminPanel && (
        <AdminPanel
          state={state}
          onSave={handleSaveState}
          onClose={() => {
            setShowAdminPanel(false);
          }}
          showPasswordPrompt={false}
          onPasswordSuccess={() => {}}
          onPasswordCancel={() => {}}
          clientId={session.clientId || spaceParam || undefined}
          onLogout={handleLogout}
        />
      )}

      {/* 📺 Persistent Global YouTube Player Container */}
      <div
        id="yt-player-wrapper"
        style={
          placeholderRect
            ? {
                position: "fixed",
                top: placeholderRect.top,
                left: placeholderRect.left,
                width: placeholderRect.width,
                height: placeholderRect.height,
                zIndex: 30,
                pointerEvents: "auto",
                transition: "opacity 0.25s ease, transform 0.25s ease",
                opacity: 1,
              }
            : {
                position: "fixed",
                top: "-9999px",
                left: "-9999px",
                width: "1px",
                height: "1px",
                zIndex: -10,
                pointerEvents: "none",
                opacity: 0,
              }
        }
        className="rounded-xl overflow-hidden bg-black shadow-lg"
      >
        <div id="yt-player-container" className="w-full h-full" />
      </div>

      {/* Receding Cinematic Flash Overlay */}
      {recedingFlash && (
        <div 
          className="fixed inset-0 bg-white pointer-events-none z-[99999]"
          style={{
            animation: "flashRecede 1200ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}
        />
      )}

      <style>{`
        @keyframes flashRecede {
          0% {
            opacity: 1;
            background-color: #ffffff;
            filter: brightness(1.5);
          }
          30% {
            opacity: 1;
            background-color: #fef3c7; /* warm golden-white medieval tint */
          }
          100% {
            opacity: 0;
            background-color: #ffffff;
          }
        }
      `}</style>
    </div>
  );
}
