// Боссов неоновый хайлайт v34 — финальная версия с настройками и звуками

import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";

console.log("[NeonHighlight v34] модуль загружен");

const DEBUG = false;
function dlog(...args) {
    if (DEBUG) console.log("[NeonHighlight]", ...args);
}

// ---------- Настройки (сохраняются в localStorage) ----------

const STORAGE_KEY = "boss-neon-settings-v34";

const defaultSettings = {
    soundEnabled: true,
    soundVolume: 0.5,
    progressBarEnabled: true,
    statsEnabled: true,
    neonUIEnabled: true,
};

function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch (e) {}
    return { ...defaultSettings };
}

function saveSettings(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
}

const settings = loadSettings();

// ---------- Звуки ----------

function playSound(type) {
    if (!settings.soundEnabled) return;
    
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = settings.soundVolume * 0.3;

        if (type === "success") {
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);        // C5
            oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);  // E5
            oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);  // G5
            gainNode.gain.setValueAtTime(settings.soundVolume * 0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.4);
        } else if (type === "error") {
            oscillator.type = "sawtooth";
            oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
            oscillator.frequency.setValueAtTime(150, audioCtx.currentTime + 0.15);
            oscillator.frequency.setValueAtTime(100, audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(settings.soundVolume * 0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        }
    } catch (e) {
        console.warn("[NeonHighlight] Ошибка воспроизведения звука:", e);
    }
}

// ---------- Неоновая тема ----------

function injectNeonTheme() {
    const styleId = "boss-neon-theme";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* ========== ОСНОВНОЙ ФОН ========== */
      body {
        background: radial-gradient(ellipse at 10% 0%, #050818 0%, #02030a 40%, #000000 100%);
        color: #e6f9ff;
        overflow: hidden;
      }

      .comfy-app, .comfyui-body {
        background-color: transparent;
      }

      /* ========== ВЕРХНЯЯ ПАНЕЛЬ И ВСЕ КНОПКИ (управляется настройкой) ========== */
      body.bn-neon-ui .comfy-menu, 
      body.bn-neon-ui .comfyui-menu, 
      body.bn-neon-ui .comfyui-toolbar,
      body.bn-neon-ui .comfy-menu *,
      body.bn-neon-ui .comfyui-menu *,
      body.bn-neon-ui header,
      body.bn-neon-ui nav,
      body.bn-neon-ui .toolbar {
        background: linear-gradient(180deg, rgba(5,15,35,0.98) 0%, rgba(2,8,20,0.98) 100%) !important;
        border-color: rgba(0, 255, 200, 0.3) !important;
      }

      body.bn-neon-ui button,
      body.bn-neon-ui .comfy-menu button,
      body.bn-neon-ui .comfyui-menu button,
      body.bn-neon-ui .comfyui-button,
      body.bn-neon-ui .p-button,
      body.bn-neon-ui .p-menubar-button,
      body.bn-neon-ui .p-menubar-item-link,
      body.bn-neon-ui [class*="button"],
      body.bn-neon-ui [class*="Button"],
      body.bn-neon-ui [class*="btn"],
      body.bn-neon-ui .cm-button,
      body.bn-neon-ui .manager-button {
        background: linear-gradient(180deg, rgba(10,30,50,0.95) 0%, rgba(5,15,30,0.95) 100%) !important;
        border: 1px solid rgba(0, 255, 200, 0.5) !important;
        border-radius: 6px !important;
        color: #b0ffee !important;
        text-shadow: 0 0 8px rgba(0, 255, 200, 0.5);
        box-shadow: 
          0 0 10px rgba(0, 255, 200, 0.2),
          inset 0 1px 0 rgba(255,255,255,0.1) !important;
        transition: all 0.2s ease !important;
      }

      body.bn-neon-ui button:hover,
      body.bn-neon-ui .comfy-menu button:hover,
      body.bn-neon-ui .comfyui-menu button:hover,
      body.bn-neon-ui .comfyui-button:hover,
      body.bn-neon-ui .p-button:hover,
      body.bn-neon-ui [class*="button"]:hover,
      body.bn-neon-ui [class*="Button"]:hover,
      body.bn-neon-ui [class*="btn"]:hover {
        background: linear-gradient(180deg, rgba(0,60,60,0.95) 0%, rgba(0,40,50,0.95) 100%) !important;
        border-color: rgba(0, 255, 200, 0.9) !important;
        color: #ffffff !important;
        box-shadow: 
          0 0 20px rgba(0, 255, 200, 0.5),
          0 0 40px rgba(0, 255, 200, 0.2),
          inset 0 1px 0 rgba(255,255,255,0.2) !important;
        transform: translateY(-1px);
      }

      body.bn-neon-ui button:active,
      body.bn-neon-ui [class*="button"]:active {
        transform: translateY(0px);
        box-shadow: 
          0 0 15px rgba(0, 255, 200, 0.6),
          inset 0 2px 4px rgba(0,0,0,0.3) !important;
      }

      body.bn-neon-ui select,
      body.bn-neon-ui .p-dropdown,
      body.bn-neon-ui .p-select,
      body.bn-neon-ui [class*="dropdown"],
      body.bn-neon-ui [class*="select"] {
        background: linear-gradient(180deg, rgba(10,25,45,0.98) 0%, rgba(5,15,30,0.98) 100%) !important;
        border: 1px solid rgba(0, 255, 200, 0.5) !important;
        border-radius: 6px !important;
        color: #b0ffee !important;
        box-shadow: 0 0 10px rgba(0, 255, 200, 0.15) !important;
      }

      body.bn-neon-ui input[type="text"],
      body.bn-neon-ui input[type="number"],
      body.bn-neon-ui input[type="search"],
      body.bn-neon-ui textarea,
      body.bn-neon-ui .p-inputtext,
      body.bn-neon-ui [class*="input"] {
        background: rgba(5, 15, 30, 0.95) !important;
        border: 1px solid rgba(0, 255, 200, 0.4) !important;
        border-radius: 6px !important;
        color: #e0ffff !important;
        box-shadow: 
          0 0 8px rgba(0, 255, 200, 0.1),
          inset 0 1px 3px rgba(0,0,0,0.3) !important;
      }

      body.bn-neon-ui input:focus,
      body.bn-neon-ui textarea:focus,
      body.bn-neon-ui .p-inputtext:focus {
        border-color: rgba(0, 255, 200, 0.8) !important;
        box-shadow: 
          0 0 15px rgba(0, 255, 200, 0.4),
          inset 0 1px 3px rgba(0,0,0,0.3) !important;
        outline: none !important;
      }

      body.bn-neon-ui .p-menu,
      body.bn-neon-ui .p-menubar,
      body.bn-neon-ui .p-dropdown-panel,
      body.bn-neon-ui .p-dialog,
      body.bn-neon-ui .p-overlaypanel,
      body.bn-neon-ui [class*="menu"],
      body.bn-neon-ui [class*="Menu"],
      body.bn-neon-ui [class*="popup"],
      body.bn-neon-ui [class*="Popup"],
      body.bn-neon-ui [class*="modal"],
      body.bn-neon-ui [class*="Modal"],
      body.bn-neon-ui [class*="dialog"],
      body.bn-neon-ui [class*="Dialog"] {
        background: linear-gradient(180deg, rgba(8,20,40,0.98) 0%, rgba(4,12,25,0.98) 100%) !important;
        border: 1px solid rgba(0, 255, 200, 0.4) !important;
        border-radius: 8px !important;
        box-shadow: 
          0 0 30px rgba(0, 255, 200, 0.2),
          0 10px 40px rgba(0,0,0,0.5) !important;
      }

      body.bn-neon-ui .p-menubar-item-link,
      body.bn-neon-ui .p-menu-item-link,
      body.bn-neon-ui .p-menuitem-link {
        color: #b0ffee !important;
      }

      body.bn-neon-ui .p-menubar-item-link:hover,
      body.bn-neon-ui .p-menu-item-link:hover,
      body.bn-neon-ui .p-menuitem-link:hover {
        background: rgba(0, 255, 200, 0.15) !important;
        color: #ffffff !important;
      }

      /* Скроллбары */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-track {
        background: rgba(0, 10, 20, 0.5);
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #00ffd5, #0088ff);
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
      }
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #00ffff, #00aaff);
      }

      /* Canvas */
      .graphcanvas,
      canvas.graphcanvas {
        background-color: transparent !important;
      }

      /* ========== ПАНЕЛЬ ОШИБОК ========== */
      #boss-neon-error-panel {
        position: fixed;
        right: 10px;
        top: 80px;
        width: 300px;
        max-height: 60vh;
        background: linear-gradient(180deg, rgba(30,5,10,0.96) 0%, rgba(15,2,5,0.96) 100%);
        border: 1px solid rgba(255, 80, 80, 0.6);
        box-shadow: 
          0 0 20px rgba(255, 80, 80, 0.4),
          0 0 60px rgba(255, 50, 50, 0.1);
        border-radius: 10px;
        padding: 0;
        font-size: 12px;
        color: #ffeaea;
        display: none;
        z-index: 9999;
        pointer-events: auto;
        overflow: hidden;
        user-select: none;
      }

      #boss-neon-error-panel .bn-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        background: rgba(80, 0, 0, 0.4);
        border-bottom: 1px solid rgba(255, 80, 80, 0.4);
        cursor: grab;
      }

      #boss-neon-error-panel .bn-header:active { cursor: grabbing; }

      #boss-neon-error-panel .bn-title {
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255, 150, 150, 0.95);
        text-shadow: 0 0 10px rgba(255, 100, 100, 0.5);
        pointer-events: none;
      }

      #boss-neon-error-panel .bn-header-buttons { display: flex; gap: 6px; }

      #boss-neon-error-panel .bn-btn {
        background: rgba(100, 20, 20, 0.8);
        border: 1px solid rgba(255, 100, 100, 0.5);
        border-radius: 4px;
        color: rgba(255, 180, 180, 0.95) !important;
        font-size: 11px;
        padding: 3px 8px;
        cursor: pointer;
        transition: all 0.15s ease;
        text-shadow: none !important;
        box-shadow: none !important;
      }

      #boss-neon-error-panel .bn-btn:hover {
        background: rgba(150, 30, 30, 0.9);
        border-color: rgba(255, 150, 150, 0.8);
        box-shadow: 0 0 12px rgba(255, 100, 100, 0.5) !important;
      }

      #boss-neon-error-panel .bn-btn-close { font-size: 16px; line-height: 1; padding: 2px 6px; }
      #boss-neon-error-panel .bn-body { padding: 8px 10px; }
      #boss-neon-error-panel .bn-list { max-height: 50vh; overflow-y: auto; }

      #boss-neon-error-panel .bn-item {
        padding: 6px 8px;
        margin-bottom: 4px;
        border-radius: 6px;
        cursor: pointer;
        background: rgba(40, 0, 0, 0.6);
        border: 1px solid transparent;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: center;
        transition: all 0.15s ease;
      }

      #boss-neon-error-panel .bn-item:hover {
        border-color: rgba(255, 120, 120, 0.9);
        background: rgba(60, 0, 0, 0.8);
        box-shadow: 0 0 10px rgba(255, 80, 80, 0.3);
      }

      #boss-neon-error-panel .bn-id { color: rgba(255, 180, 180, 0.9); font-weight: bold; margin-right: 6px; }
      #boss-neon-error-panel .bn-title-text { color: rgba(255, 220, 220, 0.95); margin-right: 6px; flex: 1; }
      #boss-neon-error-panel .bn-label { color: rgba(255, 120, 120, 1); font-weight: bold; text-shadow: 0 0 8px rgba(255, 100, 100, 0.5); }
      #boss-neon-error-panel .bn-item-close { margin-left: auto; color: rgba(255, 150, 150, 0.7); font-size: 16px; line-height: 1; padding: 0 4px; cursor: pointer; }
      #boss-neon-error-panel .bn-item-close:hover { color: rgba(255, 200, 200, 1); text-shadow: 0 0 8px rgba(255, 150, 150, 0.8); }

      /* ========== ПАНЕЛЬ СТАТИСТИКИ ========== */
      #boss-neon-stats-panel {
        position: fixed;
        left: 10px;
        bottom: 10px;
        min-width: 220px;
        background: linear-gradient(180deg, rgba(5,20,30,0.95) 0%, rgba(2,10,18,0.95) 100%);
        border: 1px solid rgba(0, 255, 200, 0.4);
        box-shadow: 0 0 20px rgba(0, 255, 200, 0.2), 0 0 60px rgba(0, 255, 200, 0.05);
        border-radius: 10px;
        padding: 0;
        font-size: 12px;
        color: #e0ffff;
        z-index: 9998;
        pointer-events: auto;
        user-select: none;
        overflow: hidden;
      }

      #boss-neon-stats-panel .bn-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        background: rgba(0, 50, 50, 0.4);
        border-bottom: 1px solid rgba(0, 255, 200, 0.3);
        cursor: grab;
      }

      #boss-neon-stats-panel .bn-header:active { cursor: grabbing; }

      #boss-neon-stats-panel .bn-title {
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(0, 255, 200, 0.9);
        text-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
        pointer-events: none;
      }

      #boss-neon-stats-panel .bn-btn-collapse {
        background: none !important;
        border: none !important;
        color: rgba(0, 255, 200, 0.7) !important;
        font-size: 14px;
        cursor: pointer;
        padding: 0 6px;
        box-shadow: none !important;
        text-shadow: none !important;
      }

      #boss-neon-stats-panel .bn-btn-collapse:hover {
        color: rgba(0, 255, 200, 1) !important;
        background: none !important;
      }

      #boss-neon-stats-panel .bn-body { padding: 8px 12px; }
      #boss-neon-stats-panel.collapsed .bn-body { display: none; }

      #boss-neon-stats-panel .bn-stat-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        border-bottom: 1px solid rgba(0, 255, 200, 0.1);
      }

      #boss-neon-stats-panel .bn-stat-row:last-child { border-bottom: none; }
      #boss-neon-stats-panel .bn-stat-label { color: rgba(150, 220, 210, 0.8); }
      #boss-neon-stats-panel .bn-stat-value { color: rgba(0, 255, 210, 1); font-weight: bold; text-shadow: 0 0 8px rgba(0, 255, 200, 0.4); }
      #boss-neon-stats-panel .bn-stat-value.success { color: rgba(100, 255, 180, 1); text-shadow: 0 0 8px rgba(100, 255, 180, 0.4); }
      #boss-neon-stats-panel .bn-stat-value.error { color: rgba(255, 120, 120, 1); text-shadow: 0 0 8px rgba(255, 100, 100, 0.4); }

      #boss-neon-stats-panel .bn-current-status {
        margin-top: 8px;
        padding: 6px 8px;
        border-radius: 6px;
        text-align: center;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      #boss-neon-stats-panel .bn-current-status.idle { background: rgba(0, 50, 50, 0.5); color: rgba(0, 200, 180, 0.9); border: 1px solid rgba(0, 200, 180, 0.3); }
      #boss-neon-stats-panel .bn-current-status.running { background: rgba(0, 80, 60, 0.6); color: rgba(0, 255, 200, 1); border: 1px solid rgba(0, 255, 200, 0.5); box-shadow: 0 0 15px rgba(0, 255, 200, 0.3); animation: statusPulse 1s ease-in-out infinite; }
      #boss-neon-stats-panel .bn-current-status.error { background: rgba(80, 20, 20, 0.6); color: rgba(255, 150, 150, 1); border: 1px solid rgba(255, 100, 100, 0.5); box-shadow: 0 0 15px rgba(255, 80, 80, 0.3); }

      @keyframes statusPulse {
        0%, 100% { opacity: 1; box-shadow: 0 0 15px rgba(0, 255, 200, 0.3); }
        50% { opacity: 0.8; box-shadow: 0 0 25px rgba(0, 255, 200, 0.5); }
      }

      /* ========== ПАНЕЛЬ НАСТРОЕК ========== */
      #boss-neon-settings-panel {
        position: fixed;
        right: 10px;
        bottom: 10px;
        min-width: 240px;
        background: linear-gradient(180deg, rgba(5,15,30,0.95) 0%, rgba(2,8,18,0.95) 100%);
        border: 1px solid rgba(0, 180, 255, 0.4);
        box-shadow: 0 0 20px rgba(0, 180, 255, 0.2);
        border-radius: 10px;
        padding: 0;
        font-size: 12px;
        color: #e0ffff;
        z-index: 9997;
        pointer-events: auto;
        user-select: none;
        overflow: hidden;
      }

      #boss-neon-settings-panel .bn-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        background: rgba(0, 40, 60, 0.4);
        border-bottom: 1px solid rgba(0, 180, 255, 0.3);
        cursor: grab;
      }

      #boss-neon-settings-panel .bn-header:active { cursor: grabbing; }

      #boss-neon-settings-panel .bn-title {
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(0, 180, 255, 0.9);
        text-shadow: 0 0 10px rgba(0, 180, 255, 0.5);
        pointer-events: none;
      }

      #boss-neon-settings-panel .bn-btn-collapse {
        background: none !important;
        border: none !important;
        color: rgba(0, 180, 255, 0.7) !important;
        font-size: 14px;
        cursor: pointer;
        padding: 0 6px;
        box-shadow: none !important;
        text-shadow: none !important;
      }

      #boss-neon-settings-panel .bn-btn-collapse:hover {
        color: rgba(0, 180, 255, 1) !important;
        background: none !important;
      }

      #boss-neon-settings-panel .bn-body { padding: 10px 12px; }
      #boss-neon-settings-panel.collapsed .bn-body { display: none; }

      #boss-neon-settings-panel .bn-setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px solid rgba(0, 180, 255, 0.1);
      }

      #boss-neon-settings-panel .bn-setting-row:last-child { border-bottom: none; }
      #boss-neon-settings-panel .bn-setting-label { color: rgba(150, 210, 230, 0.9); }

      #boss-neon-settings-panel .bn-setting-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* Toggle switch */
      #boss-neon-settings-panel .bn-toggle {
        position: relative;
        width: 44px;
        height: 22px;
        background: rgba(40, 40, 60, 0.8);
        border-radius: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid rgba(80, 80, 100, 0.5);
      }

      #boss-neon-settings-panel .bn-toggle.active {
        background: rgba(0, 120, 100, 0.8);
        border-color: rgba(0, 255, 200, 0.6);
        box-shadow: 0 0 10px rgba(0, 255, 200, 0.4);
      }

      #boss-neon-settings-panel .bn-toggle::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background: rgba(180, 180, 200, 0.9);
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      #boss-neon-settings-panel .bn-toggle.active::after {
        left: 24px;
        background: rgba(0, 255, 200, 1);
        box-shadow: 0 0 8px rgba(0, 255, 200, 0.8);
      }

      /* Volume slider */
      #boss-neon-settings-panel .bn-slider {
        width: 70px;
        height: 6px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(40, 40, 60, 0.8);
        border-radius: 3px;
        outline: none;
        border: none !important;
        box-shadow: none !important;
      }

      #boss-neon-settings-panel .bn-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: rgba(0, 255, 200, 1);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 8px rgba(0, 255, 200, 0.6);
        border: none;
      }

      #boss-neon-settings-panel .bn-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: rgba(0, 255, 200, 1);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 8px rgba(0, 255, 200, 0.6);
        border: none;
      }

      #boss-neon-settings-panel .bn-test-btn {
        background: rgba(0, 60, 80, 0.8) !important;
        border: 1px solid rgba(0, 180, 200, 0.5) !important;
        border-radius: 4px !important;
        color: rgba(0, 220, 200, 1) !important;
        font-size: 11px;
        padding: 3px 8px;
        cursor: pointer;
        text-shadow: none !important;
        box-shadow: none !important;
      }

      #boss-neon-settings-panel .bn-test-btn:hover {
        background: rgba(0, 80, 100, 0.9) !important;
        box-shadow: 0 0 10px rgba(0, 200, 200, 0.4) !important;
      }
    `;
    document.head.appendChild(style);

    // Применяем класс для неонового UI
    if (settings.neonUIEnabled) {
        document.body.classList.add("bn-neon-ui");
    }

    const LG = window.LiteGraph;
    if (LG) {
        LG.NODE_DEFAULT_BGCOLOR = "#060b16";
        LG.NODE_DEFAULT_BOXCOLOR = "#0ff";
        LG.NODE_DEFAULT_COLOR = "#eaffff";
    }
    if (app.canvas) {
        app.canvas.bgcolor = "#02040a";
    }
}

// ---------- Панель ошибок ----------

function createErrorPanel(callbacks) {
    let panel = document.getElementById("boss-neon-error-panel");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "boss-neon-error-panel";
        panel.innerHTML = `
          <div class="bn-header">
            <span class="bn-title">⚠ ОШИБКИ НОД</span>
            <div class="bn-header-buttons">
              <button class="bn-btn bn-btn-clear" title="Очистить все">✕ Все</button>
              <button class="bn-btn bn-btn-close" title="Скрыть панель">×</button>
            </div>
          </div>
          <div class="bn-body">
            <div class="bn-list"></div>
          </div>
        `;
        document.body.appendChild(panel);

        makeDraggable(panel, panel.querySelector(".bn-header"), ".bn-btn");

        panel.querySelector(".bn-btn-close").addEventListener("click", () => {
            panel.style.display = "none";
        });

        panel.querySelector(".bn-btn-clear").addEventListener("click", () => {
            if (callbacks?.onClearAll) callbacks.onClearAll();
        });
    }

    const list = panel.querySelector(".bn-list");
    return { panel, list };
}

// ---------- Панель статистики ----------

function createStatsPanel() {
    let panel = document.getElementById("boss-neon-stats-panel");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "boss-neon-stats-panel";
        panel.innerHTML = `
          <div class="bn-header">
            <span class="bn-title">📊 СТАТИСТИКА</span>
            <button class="bn-btn-collapse" title="Свернуть/развернуть">−</button>
          </div>
          <div class="bn-body">
            <div class="bn-stat-row">
              <span class="bn-stat-label">🎯 Запусков:</span>
              <span class="bn-stat-value" id="bn-stat-total">0</span>
            </div>
            <div class="bn-stat-row">
              <span class="bn-stat-label">✅ Успешно:</span>
              <span class="bn-stat-value success" id="bn-stat-success">0</span>
            </div>
            <div class="bn-stat-row">
              <span class="bn-stat-label">❌ Ошибок:</span>
              <span class="bn-stat-value error" id="bn-stat-errors">0</span>
            </div>
            <div class="bn-stat-row">
              <span class="bn-stat-label">⏱ Общее время:</span>
              <span class="bn-stat-value" id="bn-stat-time">0s</span>
            </div>
            <div class="bn-stat-row">
              <span class="bn-stat-label">📈 Среднее:</span>
              <span class="bn-stat-value" id="bn-stat-avg">0s</span>
            </div>
            <div class="bn-current-status idle" id="bn-stat-status">
              ОЖИДАНИЕ
            </div>
          </div>
        `;
        document.body.appendChild(panel);

        makeDraggable(panel, panel.querySelector(".bn-header"), ".bn-btn-collapse");

        const collapseBtn = panel.querySelector(".bn-btn-collapse");
        collapseBtn.addEventListener("click", () => {
            panel.classList.toggle("collapsed");
            collapseBtn.textContent = panel.classList.contains("collapsed") ? "+" : "−";
        });
    }

    // Применяем начальную видимость
    panel.style.display = settings.statsEnabled ? "block" : "none";

    return panel;
}

// ---------- Панель настроек ----------

function createSettingsPanel() {
    let panel = document.getElementById("boss-neon-settings-panel");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "boss-neon-settings-panel";
        panel.innerHTML = `
          <div class="bn-header">
            <span class="bn-title">⚙ НАСТРОЙКИ</span>
            <button class="bn-btn-collapse" title="Свернуть/развернуть">−</button>
          </div>
          <div class="bn-body">
            <div class="bn-setting-row">
              <span class="bn-setting-label">🔊 Звуки</span>
              <div class="bn-setting-controls">
                <div class="bn-toggle ${settings.soundEnabled ? 'active' : ''}" data-setting="soundEnabled"></div>
              </div>
            </div>
            <div class="bn-setting-row">
              <span class="bn-setting-label">🔉 Громкость</span>
              <div class="bn-setting-controls">
                <input type="range" class="bn-slider" min="0" max="100" value="${Math.round(settings.soundVolume * 100)}" data-setting="soundVolume">
                <button class="bn-test-btn" data-action="testSound">▶</button>
              </div>
            </div>
            <div class="bn-setting-row">
              <span class="bn-setting-label">📊 Прогресс-бар</span>
              <div class="bn-setting-controls">
                <div class="bn-toggle ${settings.progressBarEnabled ? 'active' : ''}" data-setting="progressBarEnabled"></div>
              </div>
            </div>
            <div class="bn-setting-row">
              <span class="bn-setting-label">📈 Статистика</span>
              <div class="bn-setting-controls">
                <div class="bn-toggle ${settings.statsEnabled ? 'active' : ''}" data-setting="statsEnabled"></div>
              </div>
            </div>
            <div class="bn-setting-row">
              <span class="bn-setting-label">🎨 Неоновый UI</span>
              <div class="bn-setting-controls">
                <div class="bn-toggle ${settings.neonUIEnabled ? 'active' : ''}" data-setting="neonUIEnabled"></div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(panel);

        makeDraggable(panel, panel.querySelector(".bn-header"), ".bn-btn-collapse, .bn-toggle, .bn-slider, .bn-test-btn");

        const collapseBtn = panel.querySelector(".bn-btn-collapse");
        collapseBtn.addEventListener("click", () => {
            panel.classList.toggle("collapsed");
            collapseBtn.textContent = panel.classList.contains("collapsed") ? "+" : "−";
        });

        // Toggle switches
        panel.querySelectorAll(".bn-toggle").forEach(toggle => {
            toggle.addEventListener("click", () => {
                const key = toggle.dataset.setting;
                settings[key] = !settings[key];
                toggle.classList.toggle("active", settings[key]);
                saveSettings(settings);

                // Применяем изменения
                if (key === "statsEnabled") {
                    const statsPanel = document.getElementById("boss-neon-stats-panel");
                    if (statsPanel) statsPanel.style.display = settings.statsEnabled ? "block" : "none";
                }
                if (key === "neonUIEnabled") {
                    document.body.classList.toggle("bn-neon-ui", settings.neonUIEnabled);
                }
            });
        });

        // Volume slider
        const volumeSlider = panel.querySelector('.bn-slider[data-setting="soundVolume"]');
        volumeSlider.addEventListener("input", (e) => {
            settings.soundVolume = e.target.value / 100;
            saveSettings(settings);
        });

        // Test sound button
        panel.querySelector('[data-action="testSound"]').addEventListener("click", () => {
            playSound("success");
        });
    }

    return panel;
}

// ---------- Делаем элемент перетаскиваемым ----------

function makeDraggable(element, handle, ignoreSelector) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    handle.addEventListener("mousedown", (e) => {
        if (ignoreSelector && e.target.closest(ignoreSelector)) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = element.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newLeft = startLeft + dx;
        let newTop = startTop + dy;

        const maxLeft = window.innerWidth - element.offsetWidth - 10;
        const maxTop = window.innerHeight - element.offsetHeight - 10;
        newLeft = Math.max(10, Math.min(newLeft, maxLeft));
        newTop = Math.max(10, Math.min(newTop, maxTop));

        element.style.left = newLeft + "px";
        element.style.top = newTop + "px";
        element.style.right = "auto";
        element.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

// ---------- геометрия ноды ----------

function getNodeRect(node) {
    try {
        if (typeof node.getBounding === "function") {
            const bb = node.getBounding();
            if (Array.isArray(bb) && bb.length === 4) {
                const [x, y, w, h] = bb;
                if (
                    Number.isFinite(x) &&
                    Number.isFinite(y) &&
                    Number.isFinite(w) &&
                    Number.isFinite(h)
                ) {
                    return { x, y, w, h };
                }
            }
        }
    } catch (e) {
        dlog("getBounding error:", e);
    }
    return {
        x: node.pos[0],
        y: node.pos[1],
        w: node.size[0],
        h: node.size[1],
    };
}

function roundedRectPath(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ---------- стили неона ----------

const styles = {
    running: {
        margin: 4,
        radius: 8,
        color: { r: 0, g: 255, b: 210 },
        baseGlowAlpha: 0.7,
        glowPulse: 0.25,
        baseLineWidth: 3,
        lineWidthPulse: 2,
        baseBlur: 16,
        blurPulse: 18,
        speed: 4,
    },
    error: {
        margin: 4,
        radius: 8,
        color: { r: 255, g: 80, b: 80 },
        baseGlowAlpha: 0.9,
        glowPulse: 0.3,
        baseLineWidth: 5,
        lineWidthPulse: 3,
        baseBlur: 22,
        blurPulse: 22,
        speed: 4,
    },
};

// ---------- подпись над нодой ----------

function drawErrorLabel(ctx, node, label) {
    if (!label) return;
    const { x, y, w } = getNodeRect(node);

    const fontSize = 14;
    const paddingX = 10;
    const paddingY = 5;
    const radius = 6;

    const tx = x + w / 2;
    const ty = y - 8;

    ctx.save();

    ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    const metrics = ctx.measureText(label);
    const bw = metrics.width + paddingX * 2;
    const bh = fontSize + paddingY * 2;
    const bx = tx - bw / 2;
    const by = ty - bh;

    ctx.fillStyle = "rgba(50, 0, 0, 0.95)";
    ctx.shadowColor = "rgba(255, 50, 50, 0.8)";
    ctx.shadowBlur = 15;
    roundedRectPath(ctx, bx, by, bw, bh, radius);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 100, 100, 0.9)";
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 200, 200, 1)";
    ctx.shadowColor = "rgba(255, 100, 100, 0.8)";
    ctx.shadowBlur = 8;
    ctx.fillText(label, tx, ty - paddingY);

    ctx.restore();
}

// ---------- прогресс-бар на ноде (БОЛЬШОЙ для 4K) ----------

function drawProgressBar(ctx, node, progress) {
    if (!settings.progressBarEnabled) return;

    const { x, y, w, h } = getNodeRect(node);
    
    const barH = 28;
    const barY = y + h + 12;
    const pct = Math.min(1, Math.max(0, progress.value / progress.max));

    ctx.save();

    ctx.fillStyle = "rgba(0, 15, 25, 0.92)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    roundedRectPath(ctx, x, barY, w, barH, 8);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(0, 255, 200, 0.6)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(0, 255, 200, 0.5)";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (pct > 0.01) {
        const fillWidth = Math.max(10, (w - 8) * pct);
        
        const gradient = ctx.createLinearGradient(x, barY, x + fillWidth, barY + barH);
        gradient.addColorStop(0, "rgba(0, 255, 150, 1)");
        gradient.addColorStop(0.3, "rgba(0, 255, 220, 1)");
        gradient.addColorStop(0.7, "rgba(0, 220, 255, 1)");
        gradient.addColorStop(1, "rgba(0, 180, 255, 1)");

        ctx.fillStyle = gradient;
        ctx.shadowColor = "rgba(0, 255, 210, 1)";
        ctx.shadowBlur = 20;

        roundedRectPath(ctx, x + 4, barY + 4, fillWidth, barH - 8, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        const highlightGradient = ctx.createLinearGradient(x, barY + 4, x, barY + barH / 2);
        highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
        highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = highlightGradient;
        roundedRectPath(ctx, x + 4, barY + 4, fillWidth, (barH - 8) / 2, 6);
        ctx.fill();
    }

    const pctValue = Math.round(pct * 100);
    const stepText = `${progress.value} / ${progress.max}`;
    const pctText = `${pctValue}%`;
    
    const textY = barY + barH / 2;
    
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillText(stepText, x + 10 + 1, textY + 1);
    ctx.fillStyle = "rgba(180, 255, 240, 1)";
    ctx.fillText(stepText, x + 10, textY);

    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillText(pctText, x + w - 10 + 1, textY + 1);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.shadowColor = "rgba(0, 255, 200, 0.8)";
    ctx.shadowBlur = 10;
    ctx.fillText(pctText, x + w - 10, textY);

    ctx.restore();
}

// ---------- рисуем неон ----------

function drawNeon(ctx, node, style, t, label) {
    const { x, y, w, h } = getNodeRect(node);
    const {
        margin,
        radius,
        color: { r, g, b },
        baseGlowAlpha,
        glowPulse,
        baseLineWidth,
        lineWidthPulse,
        baseBlur,
        blurPulse,
        speed,
    } = style;

    const pulse = 0.5 + 0.5 * Math.sin(t * speed);
    const glowAlpha = baseGlowAlpha + glowPulse * pulse;
    const lineWidth = baseLineWidth + lineWidthPulse * pulse;
    const blur = baseBlur + blurPulse * pulse;

    const x0 = x - margin;
    const y0 = y - margin;
    const w0 = w + margin * 2;
    const h0 = h + margin * 2;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${glowAlpha})`;
    ctx.shadowBlur = blur;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.98)`;

    roundedRectPath(ctx, x0, y0, w0, h0, radius);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
    ctx.stroke();

    ctx.restore();

    if (label) {
        drawErrorLabel(ctx, node, label);
    }
}

// ---------- форматирование времени ----------

function formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    const sec = Math.floor(ms / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    if (min < 60) return `${min}m ${remSec}s`;
    const hr = Math.floor(min / 60);
    const remMin = min % 60;
    return `${hr}h ${remMin}m`;
}

// ---------- Извлечение ID ноды ----------

function extractNodeId(d) {
    if (d == null) return null;

    if (typeof d === "string") {
        const n = parseInt(d, 10);
        return Number.isFinite(n) ? n : null;
    }
    if (typeof d === "number") {
        return Number.isFinite(d) ? d : null;
    }

    if (typeof d === "object") {
        const raw =
            d.node ??
            d.node_id ??
            d.nodeId ??
            d.display_node ??
            d.current_node ??
            d.id ??
            null;
        if (raw == null) return null;
        const n = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
        return Number.isFinite(n) ? n : null;
    }

    return null;
}

function idsFromPromptErrorBody(data) {
    const ids = [];
    if (!data || typeof data !== "object") return ids;
    if (!data.node_errors || typeof data.node_errors !== "object") return ids;

    for (const key of Object.keys(data.node_errors)) {
        const n = parseInt(key, 10);
        if (Number.isFinite(n)) ids.push(n);
    }
    return ids;
}

function textFromPromptNodeError(entry) {
    let text = "";

    function collect(v) {
        if (!v) return;
        if (typeof v === "string") {
            text += " " + v;
        } else if (Array.isArray(v)) {
            for (const x of v) collect(x);
        } else if (typeof v === "object") {
            if (v.message) collect(v.message);
            if (v.error) collect(v.error);
            if (v.errors) collect(v.errors);
        }
    }

    collect(entry);
    return text.toLowerCase();
}

function classifyPromptNodeError(entry) {
    const t = textFromPromptNodeError(entry);
    if (!t) return "загрузи модель!";

    if (
        t.includes("required input is missing") ||
        t.includes("missing input")
    ) {
        return "нет связи";
    }

    return "загрузи модель!";
}

function getRuntimeErrorText(d) {
    const parts = [];

    function push(v) {
        if (!v) return;
        if (typeof v === "string") parts.push(v);
        else if (typeof v === "object" && v.message) parts.push(v.message);
    }

    if (!d || typeof d !== "object") return "";

    push(d.error);
    push(d.exception);
    push(d.message);

    if (d.exec_info && typeof d.exec_info === "object") {
        push(d.exec_info.error);
        push(d.exec_info.exception);
        push(d.exec_info.message);
    }

    return parts.join(" ").toLowerCase();
}

function classifyRuntimeError(d) {
    const t = getRuntimeErrorText(d);
    if (!t) return "загрузи модель!";

    if (t.includes("missing input") || t.includes("required input")) {
        return "нет связи";
    }

    return "загрузи модель!";
}

function findNodeIdDeep(obj, depth = 0) {
    if (!obj || typeof obj !== "object" || depth > 6) return null;

    if (obj.node_errors && typeof obj.node_errors === "object") {
        const keys = Object.keys(obj.node_errors);
        if (keys.length) {
            const n = parseInt(keys[0], 10);
            if (Number.isFinite(n)) return n;
        }
    }

    if (
        obj.errors &&
        typeof obj.errors === "object" &&
        !Array.isArray(obj.errors)
    ) {
        const keys = Object.keys(obj.errors);
        if (keys.length) {
            const n = parseInt(keys[0], 10);
            if (Number.isFinite(n)) return n;
        }
    }

    const keys = Object.keys(obj);
    for (const key of keys) {
        const value = obj[key];
        const lk = key.toLowerCase();
        if (
            lk === "node_id" ||
            lk === "nodeid" ||
            lk === "node" ||
            lk === "current_node" ||
            lk === "display_node"
        ) {
            const n = typeof value === "string" ? parseInt(value, 10) : Number(value);
            if (Number.isFinite(n)) return n;
        }
    }

    for (const key of keys) {
        const value = obj[key];
        if (!value || typeof value !== "object") continue;
        const nested = findNodeIdDeep(value, depth + 1);
        if (nested != null) return nested;
    }

    return null;
}

function isErrorDetail(d) {
    if (!d || typeof d !== "object") return false;

    if (d.error || d.exception) return true;

    if (typeof d.status === "string" && d.status.toLowerCase() === "error")
        return true;

    if (d.exec_info && typeof d.exec_info === "object") {
        const e = d.exec_info;
        if (e.error || e.exception) return true;
        if (typeof e.status === "string" && e.status.toLowerCase() === "error")
            return true;
        if (Array.isArray(e.errors) && e.errors.length) return true;
        if (
            e.errors &&
            typeof e.errors === "object" &&
            !Array.isArray(e.errors) &&
            Object.keys(e.errors).length
        )
            return true;
    }

    return false;
}

// ---------- расширение ----------

app.registerExtension({
    name: "boss.NeonHighlight",

    async setup() {
        console.log("[NeonHighlight v34] setup() старт");

        injectNeonTheme();

        const canvas = app.canvas;
        if (!canvas) {
            console.warn("[NeonHighlight v34] canvas не найден");
            return;
        }

        // Состояние
        const state = {
            runningNodeId: null,
            errorNodes: new Map(),
            nodeProgress: new Map(),
            lastGraphSignature: null,
        };

        // Статистика сессии
        const stats = {
            totalRuns: 0,
            successRuns: 0,
            errorRuns: 0,
            totalTime: 0,
            currentRunStart: null,
            isRunning: false,
        };

        // Панели
        const { panel: errorPanel, list: panelList } = createErrorPanel({
            onClearAll: () => clearAllErrors(),
        });

        const statsPanel = createStatsPanel();
        const settingsPanel = createSettingsPanel();

        function forceRedraw() {
            if (app.graph?.setDirtyCanvas) {
                app.graph.setDirtyCanvas(true, true);
            }
            if (canvas.setDirty) {
                canvas.setDirty(true, true);
            }
            canvas.draw(true, true);
        }

        function clearAllErrors() {
            state.errorNodes.clear();
            state.runningNodeId = null;
            state.nodeProgress.clear();
            updateErrorPanel();
            forceRedraw();
        }

        function updateErrorPanel() {
            if (!errorPanel || !panelList) return;

            if (!state.errorNodes.size) {
                errorPanel.style.display = "none";
                panelList.innerHTML = "";
                return;
            }

            errorPanel.style.display = "block";
            panelList.innerHTML = "";

            const g = app.graph;
            for (const [id, info] of state.errorNodes.entries()) {
                const node = g?.getNodeById(id);
                const title = node?.title || node?.comfyClass || `Node ${id}`;
                const label = info.label || "загрузи модель!";

                const row = document.createElement("div");
                row.className = "bn-item";
                row.dataset.id = String(id);
                row.innerHTML =
                    `<span class="bn-id">#${id}</span>` +
                    `<span class="bn-title-text">${title}</span>` +
                    `<span class="bn-label">${label}</span>` +
                    `<span class="bn-item-close" title="Убрать">×</span>`;

                panelList.appendChild(row);
            }
        }

        function updateStatsPanel() {
            if (!settings.statsEnabled) return;

            const totalEl = document.getElementById("bn-stat-total");
            const successEl = document.getElementById("bn-stat-success");
            const errorsEl = document.getElementById("bn-stat-errors");
            const timeEl = document.getElementById("bn-stat-time");
            const avgEl = document.getElementById("bn-stat-avg");
            const statusEl = document.getElementById("bn-stat-status");

            if (totalEl) totalEl.textContent = stats.totalRuns;
            if (successEl) successEl.textContent = stats.successRuns;
            if (errorsEl) errorsEl.textContent = stats.errorRuns;
            if (timeEl) timeEl.textContent = formatTime(stats.totalTime);

            const avg = stats.successRuns > 0 ? Math.round(stats.totalTime / stats.successRuns) : 0;
            if (avgEl) avgEl.textContent = formatTime(avg);

            if (statusEl) {
                if (stats.isRunning) {
                    statusEl.className = "bn-current-status running";
                    statusEl.textContent = "⚡ ГЕНЕРАЦИЯ...";
                } else if (state.errorNodes.size > 0) {
                    statusEl.className = "bn-current-status error";
                    statusEl.textContent = "❌ ЕСТЬ ОШИБКИ";
                } else {
                    statusEl.className = "bn-current-status idle";
                    statusEl.textContent = "💤 ОЖИДАНИЕ";
                }
            }
        }

        panelList.addEventListener("click", (e) => {
            const closeBtn = e.target.closest(".bn-item-close");
            const row = e.target.closest(".bn-item");

            if (!row) return;
            const id = parseInt(row.dataset.id, 10);
            if (!Number.isFinite(id)) return;

            if (closeBtn) {
                clearError(id);
                return;
            }

            const node = app.graph?.getNodeById(id);
            if (!node) return;

            try {
                if (app.canvas?.centerOnNode) {
                    app.canvas.centerOnNode(node);
                } else if (canvas.centerOnNode) {
                    canvas.centerOnNode(node);
                }
            } catch (err) {
                console.warn("[NeonHighlight v34] centerOnNode error:", err);
            }
        });

        function startRun() {
            stats.isRunning = true;
            stats.currentRunStart = Date.now();
            stats.totalRuns++;
            state.nodeProgress.clear();
            updateStatsPanel();
        }

        function endRun(success) {
            if (stats.currentRunStart) {
                const duration = Date.now() - stats.currentRunStart;
                if (success) {
                    stats.totalTime += duration;
                    stats.successRuns++;
                } else {
                    stats.errorRuns++;
                }
            }
            stats.isRunning = false;
            stats.currentRunStart = null;
            state.nodeProgress.clear();
            state.runningNodeId = null;
            updateStatsPanel();
            forceRedraw();

            // Воспроизводим звук
            if (success) {
                playSound("success");
            } else {
                playSound("error");
            }
        }

        function setRunning(id) {
            if (id == null) return;

            if (!stats.isRunning) {
                startRun();
            }

            state.runningNodeId = id;
            if (state.errorNodes.delete(id)) {
                updateErrorPanel();
            }
            forceRedraw();
        }

        function addError(id, label) {
            if (id == null) return;
            state.runningNodeId = null;
            state.nodeProgress.delete(id);
            const info = state.errorNodes.get(id) || {};
            if (label) info.label = label;
            else if (!info.label) info.label = "загрузи модель!";
            state.errorNodes.set(id, info);
            updateErrorPanel();
            updateStatsPanel();
            forceRedraw();
        }

        function clearError(id) {
            if (id == null) return;
            if (state.errorNodes.delete(id)) {
                updateErrorPanel();
                updateStatsPanel();
                forceRedraw();
            }
        }

        function setProgress(nodeId, value, max) {
            if (nodeId == null || !Number.isFinite(nodeId)) return;
            state.nodeProgress.set(nodeId, { value: value, max: max || 100 });
            forceRedraw();
        }

        function getGraphSignature() {
            const g = app.graph;
            if (!g) return null;
            const nodes = g._nodes || [];
            const ids = nodes.map((n) => n.id).sort((a, b) => a - b).join(",");
            return `${nodes.length}:${ids}`;
        }

        function checkGraphChange() {
            const newSig = getGraphSignature();
            if (state.lastGraphSignature !== null && state.lastGraphSignature !== newSig) {
                clearAllErrors();
            }
            state.lastGraphSignature = newSig;
        }

        setInterval(checkGraphChange, 500);

        const origOnConfigure = app.graph?.onConfigure;
        if (app.graph) {
            app.graph.onConfigure = function (...args) {
                clearAllErrors();
                if (origOnConfigure) return origOnConfigure.apply(this, args);
            };
        }

        // ---- отрисовка ----

        const originalOnDrawForeground = canvas.onDrawForeground;

        canvas.onDrawForeground = function (ctx) {
            if (originalOnDrawForeground) {
                originalOnDrawForeground.call(this, ctx);
            }

            const g = this.graph;
            if (!g) return;

            const t = performance.now() / 1000;

            // Прогресс-бары (проверка settings внутри функции)
            if (state.nodeProgress.size > 0) {
                for (const [nodeId, progress] of state.nodeProgress.entries()) {
                    const node = g.getNodeById(nodeId);
                    if (node && progress.value != null) {
                        drawProgressBar(ctx, node, progress);
                    }
                }
            }

            // Неоновые рамки — ВСЕГДА включены
            if (state.runningNodeId != null) {
                const node = g.getNodeById(state.runningNodeId);
                if (node) {
                    drawNeon(ctx, node, styles.running, t, null);
                }
            }

            if (state.errorNodes.size > 0) {
                for (const [id, info] of state.errorNodes.entries()) {
                    const node = g.getNodeById(id);
                    if (node) {
                        drawNeon(ctx, node, styles.error, t, info.label);
                    }
                }
            }
        };

        // ---- события API ----

        api.addEventListener("execution_start", () => {
            startRun();
        });

        api.addEventListener("executing", (event) => {
            const d = event?.detail;
            const id = extractNodeId(d);

            if (d === null || id === null) {
                if (stats.isRunning && state.errorNodes.size === 0) {
                    endRun(true);
                }
                state.runningNodeId = null;
                forceRedraw();
                return;
            }

            setRunning(id);
        });

        api.addEventListener("executed", (event) => {
            const d = event?.detail;
            const id = extractNodeId(d);
            const err = isErrorDetail(d);

            if (err && id != null) {
                const label = classifyRuntimeError(d);
                addError(id, label);
                endRun(false);
            } else if (id != null) {
                clearError(id);
                state.nodeProgress.delete(id);
                forceRedraw();
            }
        });

        api.addEventListener("progress", (event) => {
            const d = event?.detail;
            if (!d) return;

            let nodeId = null;
            if (d.node != null) {
                nodeId = typeof d.node === "string" ? parseInt(d.node, 10) : Number(d.node);
            } else if (d.node_id != null) {
                nodeId = typeof d.node_id === "string" ? parseInt(d.node_id, 10) : Number(d.node_id);
            }

            const value = d.value ?? d.progress ?? 0;
            const max = d.max ?? d.total ?? 100;

            if (Number.isFinite(nodeId) && value != null) {
                setProgress(nodeId, value, max);
            }
        });

        api.addEventListener("status", (event) => {
            const d = event?.detail;
            if (!d) return;

            if (isErrorDetail(d)) {
                let id = extractNodeId(d);
                const ei = d.exec_info;
                if (id == null && ei) {
                    id = extractNodeId(ei);
                }

                const label = classifyRuntimeError(d);
                if (id != null) {
                    addError(id, label);
                    endRun(false);
                }
                return;
            }

            const ei = d.exec_info;
            if (ei && ei.queue_remaining === 0) {
                if (stats.isRunning && state.errorNodes.size === 0) {
                    endRun(true);
                }
                state.runningNodeId = null;
                forceRedraw();
            }
        });

        api.addEventListener("execution_error", (event) => {
            const d = event?.detail;
            if (!d) return;
            let id = extractNodeId(d);
            if (id == null && d.node != null) {
                id = typeof d.node === "string" ? parseInt(d.node, 10) : Number(d.node);
            }
            const label = classifyRuntimeError(d);
            if (id != null) addError(id, label);
            endRun(false);
        });

        // ---- перехват /api/prompt ----

        if (typeof window !== "undefined" && window.fetch && !window.__bossNeonFetchHook) {
            const originalFetch = window.fetch.bind(window);
            window.__bossNeonFetchHook = true;

            window.fetch = async (...args) => {
                const res = await originalFetch(...args);

                try {
                    const input = args[0];
                    const url =
                        typeof input === "string"
                            ? input
                            : input && input.url
                            ? input.url
                            : "";

                    if (url.includes("/api/prompt") && !res.ok) {
                        const clone = res.clone();
                        let data = null;
                        try {
                            data = await clone.json();
                        } catch (_) {
                            data = null;
                        }

                        const ids = [];
                        const labels = new Map();

                        if (data) {
                            const idList = idsFromPromptErrorBody(data);
                            for (const id of idList) {
                                ids.push(id);
                                const ne =
                                    data.node_errors &&
                                    (data.node_errors[id] ?? data.node_errors[String(id)]);
                                const lbl = classifyPromptNodeError(ne);
                                labels.set(id, lbl);
                            }

                            if (!ids.length) {
                                const n = findNodeIdDeep(data);
                                if (n != null) {
                                    ids.push(n);
                                    labels.set(n, "загрузи модель!");
                                }
                            }
                        }

                        for (const id of ids) {
                            addError(id, labels.get(id));
                        }

                        if (ids.length > 0) {
                            stats.totalRuns++;
                            stats.errorRuns++;
                            updateStatsPanel();
                            playSound("error");
                        }
                    }
                } catch (e) {
                    console.warn("[NeonHighlight v34] fetch error:", e);
                }

                return res;
            };
        }

        updateStatsPanel();

        console.log("[NeonHighlight v34] setup() завершён 🎵✨");
    },
});