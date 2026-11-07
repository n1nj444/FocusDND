# FocusDND

An Equicord userplugin that switches your Discord status to Do Not Disturb while macOS Focus is on, and restores your previous status when Focus ends.

Discord plays its own notification sounds, so macOS Focus doesn't silence them. Discord's Do Not Disturb status does.

## How it works

Every 2 seconds the plugin reads `~/Library/DoNotDisturb/DB/Assertions.json`, the file where macOS records active Focus modes. Every Focus mode counts, including scheduled ones like Sleep. If you change your status yourself while Focus is on, the plugin leaves it alone.

macOS only. Tested on Equibop with macOS 27.

## Install

1. Build Equicord from source ([docs](https://docs.equicord.org)).
2. Clone this repo into the userplugins folder:
   ```sh
   git clone https://github.com/n1nj444/FocusDND src/userplugins/focusDnd.desktop
   ```
3. Run `pnpm build` and point your client at the build. On Equibop, use the custom Equicord location setting.
4. In **System Settings → Privacy & Security → Full Disk Access**, enable Discord, Equibop or Vesktop. macOS protects the Focus file, so the plugin can't read it without this. Restart the app afterwards.
5. Enable **FocusDND** in the plugin settings.

## Caveats

- `Assertions.json` is an undocumented Apple file. A macOS update could change its format.
- Full Disk Access is a broad permission. Only grant it if you're fine with that.

## AI disclosure

This plugin was written with Claude Code (Anthropic). I tested it and reviewed it before publishing. It is not part of Equicord and isn't endorsed by the Equicord team.

## License

GPL-3.0-or-later, same as Equicord and Vencord.
