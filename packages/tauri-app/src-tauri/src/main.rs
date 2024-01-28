// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::Path};
mod exelook;
mod writer;
use active_win_pos_rs::get_active_window;

const STORAGE_PATH: &str = "E:\\program\\record-your-life";

fn watch() {
    
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn icon(file: String) -> String {
    exelook::exe_look_base64(file)
}

#[tauri::command]
fn dates() -> Vec<String> {
    let dirs = fs::read_dir(STORAGE_PATH).unwrap();
    let mut result: Vec<String> = Vec::new();
    for dir in dirs {
        if let Ok(d) = dir {
            result.push(
                d.file_name()
                    .to_string_lossy()
                    .to_string()
                    .replace(".json", ""),
            );
        }
    }
    result
}

// FIXME: return UsageMap
#[tauri::command]
fn app(file: String) -> String {
    let path = Path::new(STORAGE_PATH).join(file);
    let file = fs::read_to_string(path).unwrap_or("".to_string());
    file
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![icon, dates, app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
