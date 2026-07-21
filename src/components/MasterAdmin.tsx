import React, { useState } from "react";
import { LogOut, Plus, Trash2, Users, Key, Globe, Copy, Check, Eye, Search, Settings } from "lucide-react";
import { ClientAccount, LoveStoryState } from "../types";
import { initialStoryState } from "../constants";

interface MasterAdminProps {
  clients: ClientAccount[];
  onCreateClient: (username: string, password: string) => void;
  onDeleteClient: (id: string) => void;
  onLogout: () => void;
  onImpersonateClient: (clientId: string) => void;
  onUpdateClientWelcome: (clientId: string, gateTitle: string, gateSub: string, hubTitle: string) => void;
}

export default function MasterAdmin({
  clients,
  onCreateClient,
  onDeleteClient,
  onLogout,
  onImpersonateClient,
  onUpdateClientWelcome,
}: MasterAdminProps) {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Editing state for Gate & Hub welcome override
  const [editingClient, setEditingClient] = useState<ClientAccount | null>(null);
  const [editedGateTitle, setEditedGateTitle] = useState("");
  const [editedGateSub, setEditedGateSub] = useState("");
  const [editedHubTitle, setEditedHubTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const usernameTrimmed = newUsername.trim();
    const passwordTrimmed = newPassword.trim();

    if (!usernameTrimmed || !passwordTrimmed) {
      setFormError("Please fill in both fields! 🌸");
      return;
    }

    if (usernameTrimmed.toLowerCase() === "jasoncabria") {
      setFormError("The username 'jasoncabria' is reserved for the Master Creator! 👑");
      return;
    }

    const usernameExists = clients.some(
      (c) => c.username.toLowerCase() === usernameTrimmed.toLowerCase()
    );

    if (usernameExists) {
      setFormError("This client username already exists! 💎");
      return;
    }

    // Call create
    onCreateClient(usernameTrimmed, passwordTrimmed);
    setNewUsername("");
    setNewPassword("");
    setFormSuccess(`Successfully provisioned Client Account for ${usernameTrimmed}! ✨`);

    setTimeout(() => {
      setFormSuccess("");
    }, 4000);
  };

  const handleCopyLink = (clientId: string) => {
    const liveUrl = `${window.location.origin}${window.location.pathname}?space=${clientId}`;
    navigator.clipboard.writeText(liveUrl).then(() => {
      setCopiedId(clientId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      client.username.toLowerCase().includes(query) ||
      client.id.toLowerCase().includes(query)
    );
  });

  return (
    <div
      id="master-admin-screen"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#FFF0F3] p-4 sm:p-6 md:p-8 flex flex-col items-center"
    >
      {/* Ornate Background Elements */}
      <div className="absolute top-10 right-10 text-pink-300/40 text-8xl pointer-events-none select-none font-serif">♥</div>
      <div className="absolute bottom-10 left-10 text-amber-300/40 text-8xl pointer-events-none select-none font-serif">★</div>

      <div className="w-full max-w-5xl bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-6 sm:p-8 shadow-[0_8px_0_#4E2512] relative z-10 flex flex-col">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b-4 border-[#4E2512] pb-6 mb-8">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest block mb-1">
              👑 Master Creator Core 👑
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#EA580C]">
              Creator Control Center
            </h1>
            <p className="text-xs font-serif font-bold text-[#4E2512]/80 mt-1">
              Log in as clients, provision accounts, and manage active licenses.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] border-2 border-[#4E2512] text-white rounded-xl shadow-[0_3px_0_#4E2512] font-serif font-black text-xs cursor-pointer active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 uppercase"
          >
            <LogOut className="w-4 h-4" />
            Log Out Creator
          </button>
        </div>

        {/* Core Layout: Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Account Creator Form */}
          <div className="lg:col-span-1 bg-[#FCF6E9] border-2 border-[#4E2512] rounded-2xl p-5 shadow-[0_4px_0_#4E2512] h-fit">
            <h2 className="font-display font-black text-lg text-[#EA580C] mb-1.5 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-[#EC4899]" />
              Provision Account
            </h2>
            <p className="text-[10px] font-serif font-bold text-[#4E2512]/70 mb-4 leading-relaxed">
              Create an isolated space with a full preset. Clients can then login and customize everything.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-serif font-black uppercase text-[#4E2512]/80">
                  Client Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. alice_and_bob"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4E2512] bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F97316] text-[#4E2512]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-serif font-black uppercase text-[#4E2512]/80">
                  Set Password
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="e.g. magiclove2026"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4E2512] bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F97316] text-[#4E2512]"
                />
              </div>

              {formError && (
                <div className="text-[11px] font-bold text-red-500 font-serif">
                  ❌ {formError}
                </div>
              )}

              {formSuccess && (
                <div className="text-[11px] font-bold text-green-600 font-serif">
                  ✨ {formSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-serif font-black text-xs py-2.5 rounded-xl border-2 border-[#4E2512] shadow-[0_3px_0_#4E2512] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase tracking-wider mt-1"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* Column 2 & 3: Active Accounts Table */}
          <div className="lg:col-span-2 bg-[#FCF6E9] border-2 border-[#4E2512] rounded-2xl p-5 shadow-[0_4px_0_#4E2512] flex flex-col min-h-[360px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <h2 className="font-display font-black text-lg text-[#EA580C] flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-[#EC4899]" />
                  Active Client Database ({clients.length})
                </h2>
                <p className="text-[10px] font-serif font-bold text-[#4E2512]/70">
                  All accounts created are stored inside local persistent database storage.
                </p>
              </div>
            </div>

            {/* 🔍 Search Bar (Issue 3) */}
            <div className="mb-4 relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#4E2512]/50" />
              </span>
              <input
                id="client-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active clients by username or ID..."
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-[#4E2512] rounded-xl text-xs font-serif font-bold text-[#4E2512] placeholder-[#4E2512]/40 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>

            {clients.length === 0 ? (
              <div className="flex-1 border-2 border-dashed border-[#4E2512]/20 rounded-xl flex flex-col items-center justify-center p-8 text-center">
                <span className="text-4xl mb-2">🌸</span>
                <p className="font-serif font-black text-sm text-[#4E2512]/70">
                  No Client Accounts provisioned yet.
                </p>
                <p className="text-xs text-[#4E2512]/50 font-serif mt-1">
                  Use the left form to add accounts for clients!
                </p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="flex-1 border-2 border-dashed border-[#4E2512]/20 rounded-xl flex flex-col items-center justify-center p-8 text-center">
                <span className="text-2xl mb-2">🔍</span>
                <p className="font-serif font-black text-xs text-[#4E2512]/70">
                  No clients match "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left font-serif text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#4E2512] text-[#4E2512]/70 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-2.5 px-3">Client Space</th>
                      <th className="py-2.5 px-3">Credentials</th>
                      <th className="py-2.5 px-3">Direct Live Link</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4E2512]/10">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-[#FAF4E9]/70 transition-colors">
                        <td className="py-3.5 px-3 font-serif font-black text-sm text-[#4E2512]">
                          <div>{client.username}</div>
                          <span className="text-[9px] font-medium text-gray-500 uppercase font-sans">
                            ID: {client.id}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1 text-[#4E2512]">
                            <Key className="w-3.5 h-3.5 text-[#EA580C]" />
                            <span className="font-semibold">{client.password}</span>
                          </div>
                          <span className="text-[9px] text-gray-400">
                            Created: {new Date(client.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => handleCopyLink(client.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#4E2512] rounded-lg hover:bg-amber-50 active:scale-95 transition-all cursor-pointer font-serif font-black text-[10px]"
                          >
                            {copiedId === client.id ? (
                              <>
                                <Check className="w-3 h-3 text-green-600" />
                                <span className="text-green-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-blue-500" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => onImpersonateClient(client.id)}
                              title="Enter Client Space"
                              className="px-2.5 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white border border-[#4E2512] rounded-lg shadow-[0_2px_0_#4E2512] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-[10px] font-serif font-black flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Edit Space
                            </button>
                            
                            <button
                              onClick={() => {
                                if (
                                  confirm(`Are you sure you want to completely delete client '${client.username}'? All custom uploaded photos and text will be permanently destroyed.`)
                                ) {
                                  onDeleteClient(client.id);
                                }
                              }}
                              title="Delete Client"
                              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 border border-red-300 rounded-lg active:scale-95 transition-all cursor-pointer"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
