/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { getUserSettingLazy } from "@api/UserSettings";
import { IS_MAC } from "@utils/constants";
import definePlugin, { OptionType, PluginNative } from "@utils/types";
import { showToast, UserSettingsProtoStore } from "@webpack/common";

const Native = VencordNative.pluginHelpers.FocusDND as PluginNative<typeof import("./native")>;
const StatusSettings = getUserSettingLazy<string>("status", "status")!;

const settings = definePluginSettings({
    savedStatus: {
        type: OptionType.STRING,
        description: "Status to restore once Focus ends.",
        default: "",
        hidden: true
    }
});

let interval: ReturnType<typeof setInterval>;
let focusWasActive = false;
let warned = false;
let lastStatus: string | null = null;

async function setStatus(status: string) {
    lastStatus = status;
    await StatusSettings.updateSetting(status);
}

function handleUserSettingsChange() {
    const status = StatusSettings.getSetting();
    if (status !== lastStatus) {
        lastStatus = status;
        settings.store.savedStatus = "";
    }
}

async function check() {
    const focusActive = await Native.isFocusActive();
    if (focusActive === null) {
        if (!warned) showToast({ text: "FocusDND can't read the Focus state. Give Discord Full Disk Access and restart it.", variant: "critical" });
        warned = true;
        return;
    }
    const status = StatusSettings.getSetting();
    if (focusActive && !focusWasActive && status !== "dnd" && status !== "invisible") {
        settings.store.savedStatus = status;
        await setStatus("dnd");
    } else if (!focusActive && settings.store.savedStatus) {
        const toRestore = settings.store.savedStatus;
        settings.store.savedStatus = "";
        if (status === "dnd") await setStatus(toRestore);
    }
    focusWasActive = focusActive;
}

export default definePlugin({
    name: "FocusDND",
    description: "Switches your status to Do Not Disturb while macOS Focus is on and restores it afterwards.",
    tags: ["Activity", "Utility"],
    authors: [{ name: "n1nj444", id: 250199687762542592n }],
    hidden: !IS_MAC,
    settings,

    start() {
        lastStatus = StatusSettings.getSetting();
        UserSettingsProtoStore.addChangeListener(handleUserSettingsChange);
        check();
        interval = setInterval(check, 2000);
    },

    stop() {
        clearInterval(interval);
        UserSettingsProtoStore.removeChangeListener(handleUserSettingsChange);
    }
});
