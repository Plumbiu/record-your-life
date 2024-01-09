# record-your-life

> 记录你的 windows 应用使用时间

![terminal](./resource/terminal.png)

![web](./resource/web.png)



# 安装

1. npm 安装

```bash
npm install record-your-life -g
```

2. 设置文件存储路径

运行命令：

```bash
record-your-life set STORAGE_PATH
```

3. windows 自启动

> 图片教程在 `resource/step` 文件夹

如果不想每次开机都要启动服务，需要设置 windows 的计划任务，步骤：

- 右键 **"此电脑"**，选择**"管理"**
- 在弹出的**计算机管理**栏中选择 **“计算机管理（本地） -> 系统工具 -> 任务计划程序”**，在右边一栏中选择**创建任务**
- **常规**一栏中，名称随便取一个，勾选下方**使用最高权限运行**
- **触发器**一栏中，左下角点击**“新建**，在弹出的菜单中，将开始任务的下滑菜单选为**“登录时”**或**“启动时“**
- **操作**一栏，左下角点击**新建“**，在弹出的菜单中，**“脚本或程序“**写入 `powershell`，**“添加参数（可选）“** 写入 `-windowstyle hidden -command "record-your-life init"`
- 重启电脑或者右键启动即可

>默认情况下，`record-your-life` 5min 中会进行写入操作，如果你觉得时间不合适，可以将**“添加参数（可选）”** 一栏中的选项改为 `-windowstyle hidden -command "record-your-life init SET_TIME"`，其中 `SET_TIME` 单位是毫秒



> 如果不设置的话，默认会存储在 `npm` 全局包安装的路径


# 使用

> [!NOTE]  
> 时间日期应以 `YYYY-MM-DD` 格式，例如 `2024-01-08`，而不是 `2024-1-8`

## 终端打印

```bash
record-your-life 2024-01-08 --list
record-your-life 2024-01-08 --bar
record-your-life 2024-01-08 --table
record-your-life 2024-01-08 --board
```

## 网页

```bash
record-your-life 2024-01-08 --web
```

## --help

```bash
record-your-life

Usage:
  $ record-your-life <date>

Commands:
  set <storagePath>
  <date>
  init [timer]       init record your life

For more info, run any command with the `--help` flag:
  $ record-your-life set --help
  $ record-your-life --help
  $ record-your-life init --help

Options:
  --table     Table format of usage
  --bar       Bar chat format of usage
  --board     Board chat format of usage
  --web       Start web server
  --list      List of apps
  -h, --help  Display this message
```