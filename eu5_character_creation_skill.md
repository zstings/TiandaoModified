# EU5 Mod 角色创建 Skill

> 本文档是 EU5（Europa Universalis 5）Mod 角色创建的最佳实践总结，基于实际游戏内测试验证。
> 使用方式：在 SOLO 中编写 EU5 角色创建代码时，提供此文档作为参考上下文。

---

## 一、核心语法规则

### 1.1 create_character 参数

`create_character` 的花括号内**只能放角色相关参数**，不能放其他 effect（如 `set_variable`、`set_global_variable` 等），否则后续代码全部不执行。

**正确示例：**
```txt
create_character = {
    dynasty = dynasty:徐
    first_name = 达
    age = 23
    female = no
    culture = root.culture
    religion = root.religion
    estate = estate_type:nobles_estate
    save_scope_as = xu_da_scope
    set_global_variable = { name = xu_da_scope value = scope:xu_da_scope }
}
```

> 注意：`set_global_variable` 可以放在 `create_character` 内部（已验证可用），
> 但 `set_variable`（非全局）放在内部会导致后续代码不执行。

**支持的参数：**
| 参数 | 说明 | 示例 |
|------|------|------|
| `dynasty` | 王朝，需加 `dynasty:` 前缀 | `dynasty = dynasty:徐` |
| `first_name` | 名字 | `first_name = 达` |
| `age` | 年龄 | `age = 23` |
| `birth_date` | 出生日期（支持） | `birth_date = 1332.6.1` |
| `female` | 性别 | `female = yes / no` |
| `culture` | 文化 | `culture = root.culture` |
| `religion` | 宗教 | `religion = root.religion` |
| `estate` | 阶层 | `estate = estate_type:nobles_estate` |
| `adm / dip / mil` | 属性范围 | `adm = { 40 70 }` |
| `father` | 父亲引用 | `father = scope:xxx` 或 `father = global_var:xxx` |
| `mother` | 母亲引用 | `mother = scope:xxx` 或 `mother = global_var:xxx` |
| `save_scope_as` | 保存角色 scope | `save_scope_as = my_scope` |
| `set_global_variable` | 存全局变量（scope引用） | `set_global_variable = { name = xxx value = scope:xxx }` |

### 1.2 不支持的参数

| ❌ 错误写法 | ✅ 正确做法 |
|------------|-----------|
| `spouse = scope:xxx` | 创建后用 `marry_character` effect |
| `set_spouse = scope:xxx` | 创建后用 `marry_character` effect |
| `sibling = scope:xxx` | 让两个孩子共用相同的 `father`/`mother` |
| `set_variable = { name = xxx value = scope:xxx }` 在 create_character 内部 | 使用 `set_global_variable` 代替 |

---

## 二、scope 引用与变量

### 2.1 scope 引用方式对比

| 方式 | 语法 | 跨 on_action 持久 | 能存 scope 引用 |
|------|------|-------------------|----------------|
| `save_scope_as` | `scope:xxx` | ❌ 执行链结束后清除 | N/A |
| `set_variable` | `var:xxx` | ❌ 依赖所在 scope 生命周期 | ❌ 只能存数值/布尔 |
| `set_global_variable` | `global_var:xxx` | ✅ 全局持久 | ✅ 可以存 scope |

### 2.2 核心结论

- **`set_variable`** 只能存数值和布尔值（`value = yes`、`value = 1`），**不能存 scope**
- **`set_global_variable`** 可以存 scope 引用（`value = scope:xxx`），且全局持久
- 跨 on_action 引用角色**必须**使用 `global_var:xxx`

### 2.3 全局变量双重用途

一个全局变量可以同时充当两个角色：
1. **存储 scope 引用** → 用于 `father = global_var:xxx`
2. **"已创建"标记** → 用于 `NOT = { has_global_variable = xxx }`

```txt
# 创建角色时
create_character = {
    ...
    save_scope_as = xu_da_scope
    set_global_variable = { name = xu_da_scope value = scope:xu_da_scope }
}

# 后续引用时
if = {
    limit = {
        NOT = { has_global_variable = xu_da_scope }  # 判断是否已创建
    }
    ...
}

# 子女创建时
create_character = {
    ...
    father = global_var:xu_da_scope  # 引用父亲
}
```

---

## 三、关系建立

### 3.1 夫妻关系

`create_character` 不支持 `spouse` 参数，必须创建后单独使用 `marry_character`：

```txt
# 先创建两个角色
create_character = { ... save_scope_as = husband_scope }
create_character = { ... save_scope_as = wife_scope }

# 然后建立夫妻关系
scope:husband_scope = {
    marry_character = scope:wife_scope
}
```

使用全局变量版本（跨 on_action）：
```txt
if = {
    limit = {
        has_global_variable = husband_scope
        has_global_variable = wife_scope
        NOT = { has_global_variable = husband_wife_married }
    }
    scope:global_var:husband_scope = {
        marry_character = global_var:wife_scope
    }
    set_global_variable = { name = husband_wife_married; value = yes }
}
```

### 3.2 父子关系

直接在 `create_character` 中使用 `father` 和 `mother`：

```txt
create_character = {
    ...
    father = global_var:xu_da_scope
    mother = global_var:xie_furen_scope
}
```

### 3.3 兄弟姐妹关系

让多个孩子共用相同的 `father` 和 `mother` 即可自动建立兄弟姐妹关系。

---

## 四、on_action 系统

### 4.1 文件夹名称

- EU5 使用 `on_action`（**没有 s**）
- 不同于 EU4/CK3 的 `on_actions`

### 4.2 常用 on_action

| 名称 | 触发频率 |
|------|---------|
| `monthly_country_pulse` | 每月（国家级别） |

### 4.3 on_action 文件结构

```txt
monthly_country_pulse = {
    on_actions = {
        my_mingchu_character_spawn
    }
}

my_mingchu_character_spawn = {
    trigger = {
        tag = MNG
    }
    effect = {
        generate_character_create_effect_mingchu
    }
}
```

---

## 五、scripted_effect 规则

### 5.1 limit 必须包裹在 if 中

`limit` 放在 scripted_effect 顶层**会被忽略**，必须用 `if` 包裹：

```txt
# ❌ 错误 - limit 被忽略
generate_xxx = {
    limit = { tag = MNG }
    create_character = { ... }
}

# ✅ 正确
generate_xxx = {
    if = {
        limit = { tag = MNG }
        create_character = { ... }
    }
}
```

### 5.2 文件编码

所有脚本文件必须使用 **UTF-8 BOM** 编码保存。

---

## 六、延迟角色创建模式

### 6.1 完整模板

```txt
generate_character_create_effect_xxx = {
    # === 父亲 ===
    if = {
        limit = {
            tag = MNG
            current_date >= 1332.6.1
            NOT = { has_global_variable = father_scope }
        }
        create_named_dynasty = 徐
        create_character = {
            dynasty = dynasty:徐
            adm = { 40 70 }
            dip = { 40 70 }
            mil = { 80 99 }
            first_name = 达
            birth_date = 1332.6.1
            female = no
            culture = root.culture
            religion = root.religion
            estate = estate_type:nobles_estate
            save_scope_as = father_scope
            set_global_variable = { name = father_scope value = scope:father_scope }
        }
    }

    # === 母亲 ===
    if = {
        limit = {
            tag = MNG
            current_date >= 1334.6.1
            NOT = { has_global_variable = mother_scope }
        }
        create_named_dynasty = 谢
        create_character = {
            dynasty = dynasty:谢
            adm = { 40 70 }
            dip = { 40 70 }
            mil = { 30 60 }
            first_name = 氏
            birth_date = 1334.6.1
            female = yes
            culture = root.culture
            religion = root.religion
            estate = estate_type:nobles_estate
            save_scope_as = mother_scope
            set_global_variable = { name = mother_scope value = scope:mother_scope }
        }
    }

    # === 夫妻关系绑定 ===
    if = {
        limit = {
            current_date >= 1361.6.1
            has_global_variable = father_scope
            has_global_variable = mother_scope
            NOT = { has_global_variable = father_mother_married }
        }
        scope:global_var:father_scope = {
            marry_character = global_var:mother_scope
        }
        set_global_variable = { name = father_mother_married; value = yes }
    }

    # === 长女（延迟出生）===
    if = {
        limit = {
            tag = MNG
            current_date >= 1362.3.1
            NOT = { has_global_variable = daughter1_scope }
        }
        create_character = {
            dynasty = dynasty:徐
            adm = { 60 90 }
            dip = { 70 95 }
            mil = { 30 60 }
            first_name = 妙云
            birth_date = 1362.3.5
            female = yes
            culture = root.culture
            religion = root.religion
            estate = estate_type:nobles_estate
            father = global_var:father_scope
            mother = global_var:mother_scope
            save_scope_as = daughter1_scope
            set_global_variable = { name = daughter1_scope value = scope:daughter1_scope }
        }
    }

    # === 长子（延迟出生）===
    if = {
        limit = {
            tag = MNG
            current_date >= 1368.6.1
            NOT = { has_global_variable = son1_scope }
        }
        create_character = {
            dynasty = dynasty:徐
            adm = { 50 70 }
            dip = { 40 70 }
            mil = { 60 70 }
            first_name = 辉祖
            birth_date = 1368.6.1
            female = no
            culture = root.culture
            religion = root.religion
            estate = estate_type:nobles_estate
            father = global_var:father_scope
            mother = global_var:mother_scope
            save_scope_as = son1_scope
            set_global_variable = { name = son1_scope value = scope:son1_scope }
        }
    }
}
```

### 6.2 关键要点

1. 每个角色一个 `if` 块，`limit` 中用 `NOT = { has_global_variable = xxx }` 防重复
2. `current_date >= YYYY.M.D` 控制出生时间
3. 父母用 `global_var:xxx` 引用，不需要 `random_character` 重新查找
4. 夫妻关系绑定也需要防重复标记
5. `create_named_dynasty` 只需调用一次，后续同姓氏角色可省略

---

## 七、常见错误排查

| 症状 | 可能原因 | 解决方案 |
|------|---------|---------|
| 角色创建了两个 | on_action 触发了两次 | 用 `has_global_variable` 防重复 |
| create_character 后面的代码不执行 | 花括号内放了不支持的 effect | 移除 `set_variable` 等非参数语句 |
| 延迟角色没出现 | `limit` 在 scripted_effect 顶层 | 用 `if = { limit = { ... } }` 包裹 |
| on_action 不触发 | 文件夹名写错 | 必须是 `on_action`（无 s） |
| on_action 不触发 | 名称写错 | 确认是 `monthly_country_pulse` |
| 编码警告 | 文件非 UTF-8 BOM | 用支持 BOM 的编辑器保存 |
| dynasty 不生效 | 缺少前缀 | 改为 `dynasty = dynasty:徐` |
| 全局变量引用失败 | 用了 `var:` 前缀 | 全局变量用 `global_var:` 前缀 |

---

## 八、已验证可用的写法

```txt
# set_global_variable 存 scope（放在 create_character 内部）✅
create_character = {
    ...
    save_scope_as = test_dad
    set_global_variable = { name = test_dad_var value = scope:test_dad }
}

# set_global_variable 存 scope（放在 create_character 外部）✅
scope:test_dad = {
    set_global_variable = { name = test_dad_var value = scope:test_dad }
}

# global_var 引用作为 father/mother ✅
create_character = {
    ...
    father = global_var:test_dad_var
    mother = global_var:test_mom_var
}

# birth_date 精确日期 ✅
birth_date = 1362.3.5

# marry_character 建立夫妻关系 ✅
scope:husband_scope = {
    marry_character = scope:wife_scope
}
```

## 九、已验证不可用的写法

```txt
# set_variable 存 scope ❌（后续代码不执行）
scope:test_dad = {
    set_variable = { name = test_dad_var; value = scope:test_dad }
}

# var: 引用全局变量 ❌（前缀错误）
father = var:test_dad_var    # 全局变量必须用 global_var:

# limit 在 scripted_effect 顶层 ❌（被忽略）
generate_xxx = {
    limit = { tag = MNG }
    ...
}

# spouse 参数 ❌（不存在）
create_character = {
    ...
    spouse = scope:xxx
}

# delay 在 scripted_effect 中 ❌（不执行）
delay = { days = 10 }
```
## 注意事项
- 新创建的角色最好按照历史来，历史上不确定的出生日期就统一使用6月1号。
- 妻（未知）如果妻子未知，中文名就叫：丈夫姓+夫人，如蓝夫人。英文取名：lanyu_furen。(蓝玉拼音+夫人拼音)