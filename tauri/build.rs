use std::fs;
use std::path::Path;

fn load_dotenv() {
  let project_root = Path::new(env!("CARGO_MANIFEST_DIR")).parent().unwrap();
  let env_path = project_root.join(".env");

  if let Ok(content) = fs::read_to_string(env_path) {
    for line in content.lines() {
      let line = line.trim();
      if line.is_empty() || line.starts_with('#') {
        continue;
      }
      if let Some((key, value)) = line.split_once('=') {
        let key = key.trim();
        let value = value.trim();
        // SAFETY: Setting environment variables from a .env file in build script.
        // This is safe because we control the source (local .env file) and it's
        // only used during build configuration, not at runtime.
        unsafe {
          std::env::set_var(key, value);
        }
      }
    }
  }
}

fn main() {
  load_dotenv();

  // On Android, desktop-only commands are excluded from the invoke handler in lib.rs,
  // but we still need to list them here for Tauri's build script.
  // The actual availability is controlled by #[cfg] attributes on the command functions.
  tauri_build::try_build(tauri_build::Attributes::new().app_manifest(
    tauri_build::AppManifest::new().commands(&[
      "mark_title_bar_overlay",
      "set_notifications_count",
      "set_window_title",
      "open_new_window_cmd",
      "save_current_url",
      "set_menu_translations",
    ]),
  ))
  .expect("Failed to build Tauri application")
}
