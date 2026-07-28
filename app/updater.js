// updater.js — Auto-update content + APK version check for Android
// Works with Capacitor Filesystem API

(async () => {
  // Only run on Android (Capacitor)
  if (!window.Capacitor || !window.Capacitor.Plugins) return;

  const { Filesystem, Device } = window.Capacitor.Plugins;
  const RAW = 'https://raw.githubusercontent.com/Wastermanlord/GreatBook-Library/main';
  const CONTENT_DIR = 'content_cache';

  async function ensureDir(dir) {
    try { await Filesystem.mkdir({ path: dir, directory: 'DATA' }); } catch {}
  }

  async function readLocal(path) {
    try {
      const ret = await Filesystem.readFile({ path, directory: 'DATA' });
      return ret.data;
    } catch { return null; }
  }

  async function writeLocal(path, data) {
    const parts = path.split('/');
    if (parts.length > 1) {
      await ensureDir(parts.slice(0, -1).join('/'));
    }
    await Filesystem.writeFile({ path, data, directory: 'DATA' });
  }

  async function downloadFile(filepath) {
    try {
      const res = await fetch(RAW + '/app/' + encodeURI(filepath));
      if (!res.ok) return false;
      const text = await res.text();
      await writeLocal(CONTENT_DIR + '/' + filepath, text);
      return true;
    } catch { return false; }
  }

  // ─── Content update ──────────────────────────────────────────
  async function updateContent() {
    try {
      const res = await fetch(RAW + '/content-version.json');
      if (!res.ok) return false;
      const remote = await res.json();

      const localVer = await readLocal(CONTENT_DIR + '/version.json');
      let current = '';
      try { current = JSON.parse(localVer).version; } catch {}
      if (current === remote.version) return false;

      // Clean old cache
      try { await Filesystem.rmdir({ path: CONTENT_DIR, directory: 'DATA', recursive: true }); } catch {}
      await ensureDir(CONTENT_DIR);

      let ok = true;
      for (const f of remote.files) {
        if (!await downloadFile(f)) { ok = false; break; }
      }

      if (!ok) {
        try { await Filesystem.rmdir({ path: CONTENT_DIR, directory: 'DATA', recursive: true }); } catch {}
        return false;
      }

      await writeLocal(CONTENT_DIR + '/version.json', JSON.stringify(remote));
      return true;
    } catch { return false; }
  }

  // ─── APK version check ───────────────────────────────────────
  async function checkApkUpdate() {
    try {
      const info = await Device.getInfo();
      const currentVersion = info.appVersion || '1.0.9';

      const res = await fetch('https://api.github.com/repos/Wastermanlord/GreatBook-Library/releases/latest');
      if (!res.ok) return;
      const release = await res.json();
      const latestVersion = release.tag_name.replace(/^v/i, '');

      if (currentVersion !== latestVersion) {
        const apkAsset = release.assets.find(a => a.name.endsWith('.apk'));
        if (apkAsset) {
          window._apkUpdate = {
            version: latestVersion,
            url: apkAsset.browser_download_url
          };
          // Dispatch event for UI to handle
          window.dispatchEvent(new CustomEvent('apk-update-available', {
            detail: { version: latestVersion, url: apkAsset.browser_download_url }
          }));
        }
      }
    } catch {}
  }

  // ─── Execute ─────────────────────────────────────────────────
  const contentUpdated = await updateContent();
  if (contentUpdated) {
    window._contentUpdated = true;
    window.dispatchEvent(new CustomEvent('content-updated'));
  }

  checkApkUpdate();
})();
