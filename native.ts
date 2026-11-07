/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const assertionsFile = join(homedir(), "Library/DoNotDisturb/DB/Assertions.json");

export function isFocusActive(): boolean | null {
    try {
        const { data } = JSON.parse(readFileSync(assertionsFile, "utf8"));
        return data.some((entry: { storeAssertionRecords?: unknown[]; }) => entry.storeAssertionRecords?.length);
    } catch {
        return null;
    }
}
