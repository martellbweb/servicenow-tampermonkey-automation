// ==UserScript==
// @name         ServiceNow Queue Monitor & Alert
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automated client-side queue monitoring and UI alerts for ServiceNow instances
// @author       Seu Nome Aqui
// @match        *://*.service-now.com/*
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    // Configurações do Sistema (Fácil manutenção)
    const CONFIG = {
        searchTerms: ["INC0", "RITM0"],
        emptyTerms: ["No data available", "Nenhum registro"],
        intervals: {
            scanMs: 2000,
            controlMs: 2000
        },
        audioUrl: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    };

    let isAudioPlaying = false;
    let audioInstance = null;

    function getSafeDocument() {
        try {
            return window.top.document || document;
        } catch(e) {
            return document;
        }
    }

    function createVisualAlert() {
        const doc = getSafeDocument();
        if (doc.getElementById("global-queue-alert")) return;

        const overlay = doc.createElement("div");
        overlay.id = "global-queue-alert";
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:rgba(211, 47, 47, 0.85); color:white; font-size:5rem; font-weight:bold; display:flex; justify-content:center; align-items:center; z-index:999999; pointer-events:none;";
        overlay.innerText = "CHAMADO NA FILA N1!";

        setInterval(() => {
            overlay.style.display = overlay.style.display === "none" ? "flex" : "none";
        }, 500);

        doc.body.appendChild(overlay);
    }

    function startAlarm() {
        if (isAudioPlaying) return;
        isAudioPlaying = true;
        createVisualAlert();
        audioInstance = new Audio(CONFIG.audioUrl);
        audioInstance.loop = true;
        audioInstance.play().catch(e => console.log("Áudio bloqueado. Alerta visual ativo."));
    }

    function stopAlarm() {
        isAudioPlaying = false;
        if (audioInstance) {
            audioInstance.pause();
            audioInstance.currentTime = 0;
        }
        const doc = getSafeDocument();
        const overlay = doc.getElementById("global-queue-alert");
        if (overlay) overlay.remove();
    }

    function scanQueue() {
        let ticketFound = false;
        let queueIsEmpty = false;
        const bodyText = document.body.innerText || "";
        
        if (CONFIG.searchTerms.some(term => bodyText.includes(term))) ticketFound = true;
        if (CONFIG.emptyTerms.some(term => bodyText.includes(term))) queueIsEmpty = true;

        const allElements = document.querySelectorAll('*');
        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].shadowRoot) {
                const shadowText = allElements[i].shadowRoot.textContent || "";
                if (CONFIG.searchTerms.some(term => shadowText.includes(term))) ticketFound = true;
                if (CONFIG.emptyTerms.some(term => shadowText.includes(term))) queueIsEmpty = true;
            }
        }

        if (ticketFound && !queueIsEmpty) {
            localStorage.setItem("v1_last_ticket", Date.now().toString());
        }
    }

    function controlSiren() {
        const lastAlert = parseInt(localStorage.getItem("v1_last_ticket") || "0");
        if (Date.now() - lastAlert < 5000) {
            startAlarm();
        } else {
            stopAlarm();
        }
    }

    GM_registerMenuCommand("Trigger Test Alarm", () => {
        localStorage.setItem("v1_last_ticket", Date.now().toString());
    });
    GM_registerMenuCommand("Dismiss Alarm", stopAlarm);

    setInterval(scanQueue, CONFIG.intervals.scanMs);
    setInterval(controlSiren, CONFIG.intervals.controlMs);
})();