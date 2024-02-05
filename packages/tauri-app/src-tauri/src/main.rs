// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fmt::Debug;
use std::time::{SystemTime, UNIX_EPOCH};
use std::{fs, path::Path};
mod exelook;
use active_win_pos_rs::get_active_window;
use chrono::{DateTime, Local};
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::{
    Manager, PhysicalPosition, SystemTray, SystemTrayEvent, SystemTrayMenu, WindowEvent
};
use tokio::time;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Duration {
    pub time: u128,
    pub duration: u128,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Usage {
    pub path: String,
    pub start: u128,
    pub total: u128,
    pub end: u128,
    pub durations: Vec<Duration>,
}

pub type UsageMap = HashMap<String, Usage>;

lazy_static! {
    #[derive(Debug, Clone, Copy)]
    static ref RECORDS: Mutex<UsageMap> = {
        let m = Mutex::new(HashMap::new());
        m
    };

    static ref TODAY: String = {
        let local: DateTime<Local> = Local::now();
        let now = local.format("%Y-%m-%d");
        format!("{}.json", now.to_string())
    };
}

const STORAGE_PATH: &str = "E:\\program\\ryl-test";

#[tauri::command]
fn init() {
    let path = Path::new(STORAGE_PATH).join(TODAY.to_string());
    if Path::exists(&path) {
        let content = fs::read_to_string(&path).unwrap_or("".to_string());
        let data: Result<UsageMap, serde_json::Error> = serde_json::from_str(&content);
        if let Ok(d) = data {
            for (key, usage) in d {
                RECORDS.lock().unwrap().insert(key, usage);
            }
        }
    }
}

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

impl Usage {
    fn update(&mut self, now: u128, duraion: Duration) {
        self.durations.push(duraion);
        self.total += now - self.end;
        self.end = now;
    }
}

fn get_now_time() -> u128 {
    let start = SystemTime::now();
    let now = start.duration_since(UNIX_EPOCH).unwrap().as_millis();
    now
}

fn update_record(name: String, path: String, only_init: bool) {
    let mut binding = RECORDS.lock().unwrap();
    let record = binding.get_mut(&name);
    let now = get_now_time();
    match record {
        Some(r) => {
            if let true = only_init {
                drop(binding);
                RECORDS.lock().unwrap().insert(
                    name,
                    Usage {
                        path,
                        start: now,
                        total: 0,
                        end: now,
                        durations: Vec::new(),
                    },
                );
            } else {
                r.update(
                    now,
                    Duration {
                        time: now,
                        duration: r.total,
                    },
                );
            }
        }
        None => {
            drop(binding);
            RECORDS.lock().unwrap().insert(
                name,
                Usage {
                    path,
                    start: now,
                    total: 0,
                    end: now,
                    durations: Vec::new(),
                },
            );
        }
    }
}

#[tauri::command]
async fn watch() {
    let mut interval = time::interval(time::Duration::from_millis(500));
    let mut prev_win = get_active_window().unwrap();
    loop {
        interval.tick().await;
        let cur_app = get_active_window();
        if let Ok(cur_app) = cur_app {
            if cur_app.process_path != prev_win.process_path {
                update_record(
                    prev_win.app_name,
                    prev_win.process_path.to_string_lossy().to_string(),
                    false,
                );
                let now = get_now_time();
                let mut binding = RECORDS.lock().unwrap();
                let usage = binding.get_mut(&cur_app.app_name);
                match usage {
                    Some(r) => {
                        r.end = now;
                    }
                    None => {
                        drop(binding);
                        update_record(
                            cur_app.app_name.clone(),
                            cur_app.process_path.to_string_lossy().to_string(),
                            true,
                        );
                    }
                };
                prev_win = cur_app.clone();
            }
        }
    }
}

#[tauri::command]
async fn write() {
    let mut interval = time::interval(time::Duration::from_millis(1000));
    loop {
        interval.tick().await;
        let _ = fs::write(
            Path::new(STORAGE_PATH).join(TODAY.to_string()),
            serde_json::to_string_pretty(&<HashMap<std::string::String, Usage> as Clone>::clone(
                &RECORDS.lock().unwrap(),
            ))
            .unwrap(),
        );
    }
}

#[tokio::main]
async fn main() {
    init();
    tokio::spawn(watch());
    tokio::spawn(write());
    let _tray_menu = SystemTrayMenu::new(); // insert the menu items here
    let system_tray = SystemTray::new()
        // .with_menu(tray_menu)
        .with_tooltip("custom");
    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| {
            match event {
                SystemTrayEvent::MenuItemClick { .. } => {}
                SystemTrayEvent::RightClick { .. } => {
                    let main_window = app.get_window("main").unwrap();
                    if main_window.is_minimized().unwrap() {
                        main_window.unminimize().unwrap();
                    }
                    main_window.set_focus().unwrap();
                }
                SystemTrayEvent::LeftClick {
                    position: p,
                    size: _,
                    ..
                } => {
                    //本来以为要自己build这个窗口的，但是报错，后来发现直接获取就行了
                    //这样写有没有问题呢？每次点击都会弹出这个窗口包装成一个Arc然后move了一个副本到闭包中。
                    let tray_window = Arc::new(app.get_window("TrayPane").expect("没有该窗口"));
                    let size = tray_window.outer_size().unwrap();
                    let position_y = p.y - size.height as f64;
                    let position_x = p.x - 400 as f64;
                    tray_window
                        .set_position(PhysicalPosition::new(position_x, position_y))
                        .unwrap();
                    tray_window.show().unwrap();
                    tray_window.set_always_on_top(true).unwrap(); //不置顶这个窗口会被挡住
                    tray_window.set_focus().unwrap();
                    let arc_tray = tray_window.clone();
                    tray_window.on_window_event(move |event| match event {
                        WindowEvent::CloseRequested { .. } => {}
                        WindowEvent::Destroyed => {}
                        WindowEvent::Focused(b) => {
                            if !b {
                                // arc_tray.close().unwrap();close后再打开报错，应该要重新build了
                                arc_tray.hide().unwrap();
                            }
                        }
                        _ => {}
                    })
                }
                SystemTrayEvent::DoubleClick { .. } => {}
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            icon, dates, app, init, write, watch
        ])
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            // we perform the initialization code on a new task so the app doesn't freeze
            tauri::async_runtime::spawn(async move {
                // initialize your app here instead of sleeping :)
                // After it's done, close the splashscreen and display the main window
                main_window.show().unwrap();
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
