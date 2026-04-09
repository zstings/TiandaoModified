# Claude Code - 代码记录

这个文件用于记录和分享项目中的代码片段、技巧和最佳实践，类似于 Claude Code 的功能。

## 目录

- [事件系统](#事件系统)
- [GUI 组件](#gui-组件)
- [脚本化效果](#脚本化效果)
- [常用技巧](#常用技巧)

## 事件系统

### 基础事件结构

```txt
namespace = tests_event
tests_event.1 = {
    type = country_event
    title = "事件标题"
    immediate = {}
    desc = "事件描述"
    option = {
        name = "选项名字"
        # 执行代码
    }
}
```

### 角色改名示例

```txt
tests_event.112 = {
    type = country_event
    title = "统治者信息深度扫描"
    immediate = {
        ruler = { save_scope_as = current_monarch }
    }
    desc = "[ruler]"
    option = {
        name = "点击尝试给统治者改名"
        scope:current_monarch = {
            set_first_name = "元璋"
        }
    }
    option = {
        name = "确定"
    }
}
```

## GUI 组件

### 下拉框 (drop_down)

```gui
drop_down = {
    name = "tiandao_attr_selector"
    size = { 150 30 }
    active_item = {
        widget_standard = {
            size = { 100% 100% }
            text_single = { text = "当前选择的属性" }
        }
    }
    item_adapter = {
        list = {
            datamodel = "[GetPlayer.GetCustomList]"
            item = {
                widget_standard = {
                    button_normal = { onclick = "[...]" }
                }
            }
        }
    }
}
```

### 单选按钮

- `button_checkbox_auto` - 游戏内部的单选按钮，点击后会切换状态

## 脚本化效果

### 创建角色

```txt
create_named_dynasty = xu_dynasty
create_character = {
    mil = { 80 100 }
    adm = { 80 100 }
    dip = { 80 100 }
    dynasty = dynasty:xu_dynasty
    first_name = "达"
    age = 32
    is_female = no
    culture = root.culture
    religion = root.religion
    traits = { great_general }
}
```

### 关系设置

```txt
# ✅ 用 marry_character 设置夫妻关系（双向）
scope:target_character = {
    marry_character = scope:recipient
}
```

## 常用技巧

1. **命名空间**：每个事件文件必须有一个 namespace
2. **事件命名**：格式为 namespace.事件ID，确保唯一性
3. **GUI 性能**：下拉框 (drop_down) 性能开销大，简单选择建议用多个 button
4. **编码格式**：所有文件必须是 utf-8 with BOM 编码
5. **调试技巧**：使用 `debug_breakpoint = yes` 查看角色属性

## 调试命令

在控制台里调用 GUI 的方法：

```
gui.CreateWidget gui/tiandao_nickname.gui tiandao_nickname
gui.ClearWidgets
```

## 注意事项

- 事件必须有至少一个选项，否则弹出来关不掉
- 复杂 GUI 要注意层级，不可见 ≠ 不创建
- 高频刷新的界面避免使用下拉框，会导致卡顿
- 未成年角色昵称修改后游戏不显示，成年后正常显示
- 部分角色改名后显示旧名字，但是调试模式可以看到修改的新名字