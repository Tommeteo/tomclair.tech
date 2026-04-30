/**
 * J.A.R.V.I.S — Interface Mobile (VERSION CORRIGÉE)
 *
 * Connexion manuelle avec saisie d'IP pour éviter les problèmes de détection auto.
 * Utilise Web Speech API pour STT (voix → texte) et SpeechSynthesis pour TTS.
 */

// ── Config ─────────────────────────────────────────────────────────────────
let WS_URL = null;  // Sera défini après saisie de l'IP
let SERVER_IP = localStorage.getItem('jarvis_ip') || '192.168.1.23';
const RECONNECT_DELAY_MS = 3000;
const PING_INTERVAL_MS = 15000;
let pingTimer = null;
const SPEECH_LANG = "fr-FR";

// ── DOM Refs ────────────────────────────────────────────────────────────────
const configPanel = document.getElementById("config-panel");
const configStatus = document.getElementById("config-status");
const serverIpInput = document.getElementById("server-ip");
const reconnectBtn = document.getElementById("reconnect-btn");
const badgeEl = document.getElementById("connection-badge");
const badgeLabelEl = document.getElementById("connection-label");
const statusEl = document.getElementById("status-text");
const userTextEl = document.getElementById("user-text");
const jarvisTextEl = document.getElementById("jarvis-text");
const micBtn = document.getElementById("mic-btn");
const micIcon = micBtn.querySelector(".mic-icon");
const stopIcon = micBtn.querySelector(".stop-icon");
const micLabelEl = document.getElementById("mic-label");
const stopJarvisBtn = document.getElementById("stop-jarvis-btn");

// ── État ───────────────────────────────────────────────────────────────────
let currentState = "idle";
let ws = null;
let isListening = false;
let reconnectTimer = null;
let isConnected = false;

// ── Initialisation ─────────────────────────────────────────────────────────
serverIpInput.value = SERVER_IP;

// ── Gestion des états ───────────────────────────────────────────────────────
const STATE_LABELS = {
  idle: "en attente",
  listening: "je vous écoute...",
  thinking: "en réflexion...",
  speaking: "jarvis répond...",
};

function applyState(state) {
  document.body.classList.remove("state-idle", "state-listening", "state-thinking", "state-speaking");
  document.body.classList.add(`state-${state}`);
  currentState = state;
  statusEl.textContent = STATE_LABELS[state] || state;

  if (state === "speaking") {
    stopJarvisBtn.style.display = "flex";
  } else {
    stopJarvisBtn.style.display = "none";
  }

  if (state === "listening") {
    micIcon.style.display = "none";
    stopIcon.style.display = "block";
    micLabelEl.textContent = "APPUYER POUR ARRÊTER";
  } else {
    micIcon.style.display = "block";
    stopIcon.style.display = "none";
    micLabelEl.textContent = "APPUYER POUR PARLER";
  }
}

applyState("idle");

// ── Configuration IP ────────────────────────────────────────────────────────
function showConfig() {
  configPanel.classList.remove("hidden");
  reconnectBtn.classList.remove("visible");
}

function hideConfig() {
  configPanel.classList.add("hidden");
}

function showConfigStatus(msg, isError = false) {
  configStatus.textContent = msg;
  configStatus.className = "status-msg " + (isError ? "error" : "success");
  configStatus.style.display = "block";
}

function autoDetectIP() {
  // Liste des IPs courantes à tester
  const commonIPs = ['192.168.1.23', '192.168.1.10', '192.168.0.10', '192.168.1.100', '10.0.0.10'];
  
  showConfigStatus("🔍 Détection en cours...");
  
  // Essayer de trouver l'IP automatiquement
  let found = false;
  const testNext = async (index) => {
    if (index >= commonIPs.length) {
      if (!found) {
        showConfigStatus("❌ IP non trouvée automatiquement. Vérifie l'IP de ton PC avec ipconfig", true);
      }
      return;
    }
    
    const ip = commonIPs[index];
    try {
      const response = await fetch(`http://${ip}:8080/mobile/`, { 
        method: 'HEAD',
        mode: 'no-cors',
        timeout: 2000
      });
      // Si on arrive ici, c'est que ça a répondu
      serverIpInput.value = ip;
      showConfigStatus(`✅ IP trouvée : ${ip}`);
      found = true;
    } catch (e) {
      // Continue avec la prochaine IP
      testNext(index + 1);
    }
  };
  
  testNext(0);
}

function connectToJarvis() {
  const ip = serverIpInput.value.trim();
  
  if (!ip || ip === '') {
    showConfigStatus("❌ Veuillez entrer une adresse IP", true);
    return;
  }
  
  // Sauvegarder l'IP
  SERVER_IP = ip;
  localStorage.setItem('jarvis_ip', ip);
  WS_URL = `ws://${ip}:8765`;
  
  showConfigStatus("⏳ Connexion en cours...");
  
  // Tester la connexion HTTP d'abord
  fetch(`http://${ip}:8080/mobile/`, { method: 'HEAD', mode: 'no-cors' })
    .then(() => {
      // Si HTTP fonctionne, essayer WebSocket
      tryConnectWS();
    })
    .catch(() => {
      showConfigStatus("❌ Impossible de contacter Jarvis. Vérifie que:\n1. Jarvis est démarré sur le PC\n2. Le PC et téléphone sont sur le même WiFi\n3. L'IP est correcte (ipconfig sur PC)", true);
    });
}

// ── WebSocket ───────────────────────────────────────────────────────────────
function tryConnectWS() {
  if (!WS_URL) return;
  
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
  
  console.log("[WS] Tentative connexion à", WS_URL);
  
  try {
    ws = new WebSocket(WS_URL);
    
    // Timeout de connexion
    const connectionTimeout = setTimeout(() => {
      if (ws && ws.readyState !== WebSocket.OPEN) {
        ws.close();
        showConfigStatus("❌ Timeout connexion. Vérifie l'IP et que Jarvis est démarré.", true);
      }
    }, 5000);

    ws.addEventListener("open", () => {
      clearTimeout(connectionTimeout);
      console.log("[WS] Connecté!");
      isConnected = true;
      hideConfig();
      setConnected(true);
      showConfigStatus("✅ Connecté à Jarvis!");
      
      reconnectBtn.classList.remove("visible");
      
      pingTimer = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, PING_INTERVAL_MS);
    });

    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ping" || data.type === "pong") return;
        
        if (data.state && data.state !== "speaking") {
          applyState(data.state);
        }
        
        if (data.action === "jarvis_response" && data.text) {
          afficherReponseJarvis(data.text);
          parleSynthese(data.text);
        }
      } catch (e) {
        console.error("[WS] Erreur parsing:", e);
      }
    });

    ws.addEventListener("close", () => {
      clearTimeout(connectionTimeout);
      console.log("[WS] Déconnecté");
      isConnected = false;
      setConnected(false);
      applyState("idle");
      reconnectBtn.classList.add("visible");
      
      if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
    });

    ws.addEventListener("error", (error) => {
      clearTimeout(connectionTimeout);
      console.error("[WS] Erreur:", error);
      setConnected(false);
      showConfigStatus("❌ Erreur WebSocket. Vérifie l'IP.", true);
    });
    
  } catch (e) {
    console.error("[WS] Exception:", e);
    showConfigStatus("❌ Erreur création WebSocket", true);
  }
}

function setConnected(ok) {
  badgeEl.classList.toggle("connected", ok);
  badgeEl.classList.toggle("disconnected", !ok);
  badgeLabelEl.textContent = ok ? "connecté" : "déconnecté";
}
setConnected(false);

function sendCommand(text) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn("[WS] Non connecté");
    userTextEl.textContent = "⚠️ Non connecté à Jarvis";
    reconnectBtn.classList.add("visible");
    return false;
  }
  ws.send(JSON.stringify({ type: "mobile_command", text }));
  return true;
}

// ── Stop Jarvis ────────────────────────────────────────────────────────────
let lastStopClick = 0;
stopJarvisBtn.addEventListener("click", () => {
  const now = Date.now();
  if (now - lastStopClick < 500) return;
  lastStopClick = now;
  
  window.speechSynthesis.cancel();
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "stop_audio" }));
  }
  applyState("idle");
});

// ── Affichage dialogue ─────────────────────────────────────────────────────
function afficherReponseJarvis(text) {
  const textePropre = text
    .replace(/\{[^}]*\}/gs, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  jarvisTextEl.textContent = textePropre || text;
}

// ── TTS ─────────────────────────────────────────────────────────────────────
let synthVoice = null;

function chargerVoix() {
  const voices = window.speechSynthesis.getVoices();
  synthVoice =
    voices.find(v => v.lang === "fr-FR" && v.name.includes("Google")) ||
    voices.find(v => v.lang === "fr-FR") ||
    voices.find(v => v.lang.startsWith("fr")) ||
    null;
}

window.speechSynthesis.addEventListener("voiceschanged", chargerVoix);
chargerVoix();

function parleSynthese(texte) {
  window.speechSynthesis.cancel();
  
  const textePropre = texte.replace(/\{[^}]*\}/gs, "").replace(/\s{2,}/g, " ").trim();
  if (!textePropre) return;
  
  applyState("speaking");
  
  const utterance = new SpeechSynthesisUtterance(textePropre);
  utterance.lang = SPEECH_LANG;
  utterance.rate = 0.95;
  utterance.pitch = 0.9;
  utterance.volume = 1.0;
  if (synthVoice) utterance.voice = synthVoice;
  
  utterance.addEventListener("end", () => applyState("idle"));
  utterance.addEventListener("error", () => applyState("idle"));
  
  window.speechSynthesis.speak(utterance);
}

// ── STT ────────────────────────────────────────────────────────────────────
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = SPEECH_LANG;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.addEventListener("start", () => {
    isListening = true;
    applyState("listening");
    userTextEl.textContent = "";
    jarvisTextEl.textContent = "";
  });

  recognition.addEventListener("result", (event) => {
    let interim = "";
    let final_txt = "";
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final_txt += transcript;
      } else {
        interim += transcript;
      }
    }
    
    userTextEl.textContent = `"${final_txt || interim}"`;
  });

  recognition.addEventListener("end", () => {
    isListening = false;
    const texteCapture = userTextEl.textContent.replace(/^"|"$/g, "").trim();
    
    if (texteCapture) {
      applyState("thinking");
      const envoyé = sendCommand(texteCapture);
      if (!envoyé) {
        applyState("idle");
      }
    } else {
      applyState("idle");
    }
  });

  recognition.addEventListener("error", (event) => {
    console.warn("[STT] Erreur:", event.error);
    isListening = false;
    applyState("idle");
    
    if (event.error === "not-allowed") {
      userTextEl.textContent = "⚠️ Micro non autorisé";
    } else if (event.error === "no-speech") {
      userTextEl.textContent = "";
    } else {
      userTextEl.textContent = `⚠️ Erreur: ${event.error}`;
    }
  });
} else {
  micBtn.disabled = true;
  statusEl.textContent = "micro non supporté";
}

// ── Bouton microphone ───────────────────────────────────────────────────────
micBtn.addEventListener("click", () => {
  if (!recognition) return;
  if (currentState === "thinking" || currentState === "speaking") return;
  
  if (isListening) {
    recognition.stop();
  } else {
    window.speechSynthesis.cancel();
    try {
      recognition.start();
    } catch (e) {
      console.warn("[STT] Impossible de démarrer:", e);
    }
  }
});

// ── Cleanup ────────────────────────────────────────────────────────────────
window.addEventListener("beforeunload", () => {
  if (ws) ws.close(1000, "Page fermée");
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (pingTimer) clearInterval(pingTimer);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && isConnected && (!ws || ws.readyState !== WebSocket.OPEN)) {
    console.log("[WS] Reconnexion...");
    tryConnectWS();
  }
});

console.log("[JARVIS MOBILE] Prêt. Attente de connexion...");
