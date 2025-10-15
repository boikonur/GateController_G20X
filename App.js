import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function G202SmsTool() {
  const STORAGE_KEY = "g202_users";
  const SETTINGS_KEY = "g202_settings";
  const [password, setPassword] = useState("1138");
  const [phone, setPhone] = useState("");
  const [alias, setAlias] = useState("");
  const [slot, setSlot] = useState("");
  const [relayTime, setRelayTime] = useState(10);
  const [command, setCommand] = useState("");
  const [users, setUsers] = useState({});
  const [response, setResponse] = useState("");
  const [deviceNumber, setDeviceNumber] = useState("");

  useEffect(() => {
    const rawUsers = localStorage.getItem(STORAGE_KEY);
    const rawSettings = localStorage.getItem(SETTINGS_KEY);
    if (rawUsers) {
      try {
        setUsers(JSON.parse(rawUsers));
      } catch {
        setUsers({});
      }
    }
    if (rawSettings) {
      try {
        const parsed = JSON.parse(rawSettings);
        if (parsed.deviceNumber) setDeviceNumber(parsed.deviceNumber);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ deviceNumber }));
  }, [deviceNumber]);

  function normalizeLocal(number) {
    const cleaned = number.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) return "00359" + cleaned.slice(1);
    if (cleaned.startsWith("+")) return cleaned.replace(/^\+/, "00359");
    if (cleaned.startsWith("359")) return "00359" + cleaned.slice(3);
    return cleaned;
  }

  function buildTelCmd(p, s) {
    const slotNum = String(s).padStart(3, "0");
    return `${password}#TEL${p}#${slotNum}#`;
  }

  function sendCommand(cmd) {
    if (!deviceNumber) {
      alert("Please set the default device number first.");
      return;
    }
    setCommand(cmd);
    const smsLink = `sms:${deviceNumber}?body=${encodeURIComponent(cmd)}`;
    window.location.href = smsLink;
    setResponse(`📤 Ready to send via SMS: ${cmd}`);
  }

  function handleAddUser() {
    if (!phone || !slot) return alert("Fill phone and slot");
    const intl = normalizeLocal(phone);
    const cmd = buildTelCmd(intl, slot);
    setUsers((u) => ({ ...u, [String(slot).padStart(3, "0")]: { phone, alias } }));
    sendCommand(cmd);
  }

  function handleSimple(suffix) {
    const cmd = `${password}${suffix}`;
    sendCommand(cmd);
  }

  function handleSetRelayTime() {
    const cmd = `${password}#GOT${relayTime}#`;
    sendCommand(cmd);
  }

  const btnStyle =
    "p-3 rounded-xl text-white font-medium shadow hover:opacity-90 transition-all";

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 p-4 flex flex-col items-center">
      <motion.div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-600">G202 SMS Web Controller</h1>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            value={deviceNumber}
            onChange={(e) => setDeviceNumber(e.target.value)}
            placeholder="Default Device Number (e.g. 0878650569)"
            className="p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (default 1138)"
            className="p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Alias" className="p-3 rounded-xl border border-indigo-200" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (e.g. 0882513380)" className="p-3 rounded-xl border border-indigo-200" />
          <input value={slot} onChange={(e) => setSlot(e.target.value)} placeholder="Slot (1-200)" className="p-3 rounded-xl border border-indigo-200" />
          <div className="flex gap-2 items-center">
            <select value={relayTime} onChange={(e) => setRelayTime(e.target.value)} className="p-3 rounded-xl border border-pink-300">
              {[5, 10, 15, 20, 30, 45, 60].map((t) => (
                <option key={t} value={t}>{t}s</option>
              ))}
            </select>
            <button onClick={handleSetRelayTime} className="p-3 bg-pink-500 rounded-xl text-white font-medium shadow">⏱️ Set</button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <button onClick={handleAddUser} className={`${btnStyle} bg-green-500`}>➕ Add User</button>
          <button onClick={() => handleSimple("#DD#")} className={`${btnStyle} bg-red-500`}>🗑️ Delete All</button>
          <button onClick={() => handleSimple("#AU#")} className={`${btnStyle} bg-indigo-500`}>🔒 Authorized Only</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <button onClick={() => handleSimple("#ON#")} className={`${btnStyle} bg-emerald-500`}>🚪 Open Gate</button>
          <button onClick={() => handleSimple("#OFF#")} className={`${btnStyle} bg-sky-500`}>🔒 Close Gate</button>
          <button onClick={() => handleSimple("#RESET#")} className={`${btnStyle} bg-gray-600`}>♻️ Factory Reset</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          <button onClick={() => handleSimple("#R#")} className={`${btnStyle} bg-orange-500`}>🔕 Disable Notifications</button>
          <button onClick={() => handleSimple("#N#")} className={`${btnStyle} bg-blue-500`}>🔔 Enable Notifications</button>
        </div>

        <div className="mb-4 bg-gray-100 p-4 rounded-xl">
          <div className="text-sm font-semibold mb-1 text-gray-700">Last Command:</div>
          <pre className="text-indigo-600 font-mono text-sm overflow-x-auto">{response || command || "(none)"}</pre>
        </div>

        <div className="bg-white border rounded-xl p-3 shadow-inner">
          <h2 className="text-lg font-semibold mb-2 text-indigo-600">Stored Users</h2>
          {Object.keys(users).length === 0 ? <div className="text-gray-500 text-sm">No users stored</div> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-700">
                  <th className="text-left p-1">Slot</th>
                  <th className="text-left p-1">Alias</th>
                  <th className="text-left p-1">Phone</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(users).sort((a, b) => a[0].localeCompare(b[0])).map(([s, { phone, alias }]) => (
                  <tr key={s} className="border-t border-gray-200">
                    <td className="p-1 text-gray-700">{s}</td>
                    <td className="p-1 text-gray-700">{alias || "-"}</td>
                    <td className="p-1 text-gray-600">{phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
