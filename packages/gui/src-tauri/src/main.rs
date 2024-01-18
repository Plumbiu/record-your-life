// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use crate::types::Config;
use lazy_static::lazy_static;
use serde_json::from_str;
use std::{collections::HashMap, env::current_exe};
use tauri::{Menu, window};
mod types;
use std::{env, fs, path::Path};
const CONFIG_PATH: &str = "npm/node_modules/record-your-life/dist/record-your-life.json";

lazy_static! {
    static ref CONFIG: HashMap<&'static str, String> = {
        let mut m = HashMap::new();
        let args = env::var_os("APPDATA").unwrap();
        let config_path = Path::new(&args).join(CONFIG_PATH);
        let config = fs::read_to_string(config_path).unwrap();
        let config: Config = from_str(config.as_str()).unwrap();
        m.insert(CONFIG_PATH, config.storagePath);
        m
    };
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_data(date: &str) -> String {
    fs::read_to_string(format!(
        "{}/{}.json",
        CONFIG.get(CONFIG_PATH).unwrap(),
        date
    ))
    .unwrap()
}

fn main() {
    let path = current_exe().unwrap();
    window::Monitor::
    println!("exe: {:?}", path);
    let menu = Menu::new();
    tauri::Builder::default()
        .menu(menu)
        .invoke_handler(tauri::generate_handler![greet, get_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
