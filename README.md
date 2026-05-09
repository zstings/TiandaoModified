# 天道·修改器 (Tiandao Modified)

一个 Europa Universalis V (EU5) 的 Mod，提供强大的角色管理和修改功能。

![Mod 预览图](_resources/preview.png)

## 版本信息

- **Mod版本**：1.1
- **支持游戏版本**：1.1.0

## 功能特性

### 核心功能

- **天道·角色修改器**：在角色交互菜单中添加修改按钮，支持自定义修改角色名字、昵称、军事、行政、外交属性。
- **天道·角色创建**：新增自定义角色创建功能，支持设置角色性别、年龄、姓氏、名字及三维属性。**仅对君主显示**。
- **天道·控制台修改器**：新增控制台修改器功能，可直接在游戏内执行控制台指令。**仅对君主显示**。
- **天道·天道赐婚**：支持手动为角色安排婚姻，自动过滤同姓、近亲，确保婚姻合法性。
- **天道·设置父母**：支持手动设置角色的父母关系，建立家族血缘纽带。

### 明初武将家族系统

自动生成明朝开国功臣家族，包括：

- **徐达家族**：徐达、谢翠娥（妻）
- **常遇春家族**：常遇春、蓝月娥（妻）、常茂（长子）、常婉清（长女）
- **刘伯温家族**：刘基、陈淑贤（妻）、刘琏（长子）、刘璟（次子）
- **李善长家族**：李善长、李夫人（妻）、李祺（长子）
- **汤和家族**：汤和、胡婉如（妻）、汤鼎（长子）、汤軏（次子）
- **傅友德家族**：傅友德、傅夫人（妻）、傅忠（长子）、傅让（次子）
- **沐英家族**：沐英、耿婉清（继室）、沐春（长子）、沐晟（次子）

家族成员会根据历史时间自动出现，并自动安排相互通婚。

## 项目结构

```
Celestial-Micro/
├── .metadata/                          # Mod 元数据
├── _resources/                         # 资源文件（预览图等）
├── in_game/                            # 游戏内功能文件
│   ├── common/
│   │   ├── character_interactions/     # 角色交互定义
│   │   │   ├── tiandao_character_modifier_interaction.txt
│   │   │   ├── tiandao_character_create_modifier_interaction.txt
│   │   │   ├── tiandao_console_modifier_interaction.txt
│   │   │   ├── tiandao_marriage_interaction.txt
│   │   │   ├── tiandao_setup_father_interaction.txt
│   │   │   └── tiandao_setup_mother_interaction.txt
│   │   ├── scripted_effects/           # 脚本效果
│   │   │   └── use_tiandao_effects.txt
│   │   ├── scripted_triggers/          # 脚本触发器
│   │   │   └── tiandao_triggers.txt
│   │   ├── script_values/              # 脚本值
│   │   │   └── tiandao_values.txt
│   │   ├── scripted_guis/              # 脚本 GUI
│   │   │   └── use_tiandao_sgui.txt
│   │   └── on_action/                  # 事件触发
│   │       └── tiandao_on_actions.txt
│   ├── gui/                            # GUI 界面文件
│   │   ├── tiandao_app_components.gui
│   │   ├── tiandao_character_modifier.gui
│   │   ├── tiandao_character_create_modifier.gui
│   │   └── tiandao_console_modifier.gui
│   └── events/                         # 事件文件
│       └── tiandao_event.txt
└── main_menu/                          # 主菜单相关文件
```

## 安装与使用

1. 将本项目全部下载下来，把文件放入游戏的 `mod` 文件夹中。
2. 游戏启动后在 mod 管理里勾选 `天道·修改器`。
3. 进入游戏后，右键点击角色，即可在菜单中看到天道系列功能。

## 技术实现

### 架构设计

- **交互系统**：使用 `character_interactions` 定义右键菜单选项
- **GUI 系统**：使用 `.gui` 文件定义弹窗界面，支持输入框、复选框等控件
- **脚本效果**：使用 `scripted_effects` 封装可复用的逻辑
- **脚本触发器**：使用 `scripted_triggers` 定义条件判断
- **全局变量**：使用 `global_variable` 在 GUI 和脚本间传递数据

### 关键技术点

- 使用 `ExecuteConsoleCommand` 实现游戏内控制台功能
- 使用 `blockoverride` 机制实现 GUI 组件复用
- 使用 `scope` 和 `global_variable` 实现数据传递
- 使用 `on_action` 实现定时触发（如每月自动生成角色）

## 注意事项

- **成就兼容性**：使用本 Mod 会修改游戏校验码（Checksum），导致无法获得官方成就。
- **联机说明**：由于采用了底层指令注入技术，本 Mod 仅建议在单机模式下使用。
- **实时生效**：所有修改在点击确认后立即生效，无需重启游戏或等待下月刷新。
- **未成年角色**：昵称修改后游戏不显示，成年后正常显示。
- **角色改名**：部分角色改名后显示旧名字，但调试模式可以看到修改的新名字（这部分角色界面使用 ShortName 而非 FirstName，游戏目前没有提供接口来修改 ShortName）。

## 开发参考

- [EU5 Character Modding Wiki](https://eu5.paradoxwikis.com/Character_modding)
- [EU5 Modding Documentation](https://eu5.paradoxwikis.com/Modding)

## 许可证

本项目仅供学习和个人使用。
