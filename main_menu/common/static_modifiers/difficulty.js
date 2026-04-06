const difficulty = `
    #政府改革槽位
	government_reform_slots = 5
	#内阁席位数
	government_size = 3
	#每月正统
	monthly_legitimacy = 1
	#要塞维护费
	fort_maintenance_cost = -2
	#人力/水手
	global_manpower_modifier = 1
	global_sailors_modifier = 1
	#每月通货膨胀
	monthly_inflation = -0.5
	#陆军/海军维护费
	army_maintenance_cost = -0.5
	navy_maintenance_cost = -0.5
	#陆军/海军作战能力
	army_infantry_power = 2
	navy_transport_power = 2
	#陆军\海军移动速度
	army_movement_speed = 10
	navy_movement_speed = 10
	#陆军消耗
	local_army_attrition = -1
	#整合速度
	global_integration_speed_modifier = 500
	#补给上限
	global_supply_limit_modifier = 10
	#道路\原产建造时间、建筑建造速度
	global_road_building_time = -10
	global_rgo_build_time = -10
	global_construction_speed = 10
	# 全局\月 控制力
	global_monthly_control = 10
	global_max_control = 100
	#造船速度
	ship_build_speed = 1
	#招募速度
	regiment_recruit_speed = 1
	#角色预期寿命
	global_life_expectancy = 10
	#生育能力
	character_fertility = 1
	#人口增长
	global_population_growth = 0.01
	#文化转变速度
	global_pop_assimilation_speed_modifier = 10
	#宗教转变速度
	global_pop_conversion_speed = 10
	#人口皈依速度
	global_pop_conversion_speed_modifier = 10
	#吞并速度
	annexation_speed = 10
	#每月叛乱增长
	monthly_rebel_growth = -10
	# 市民、教士、贵族、农民、部落
	burghers_estate_target_satisfaction = 1
	clergy_estate_target_satisfaction = 1
	nobles_estate_target_satisfaction = 1
	peasants_estate_target_satisfaction = 1
	tribes_estate_target_satisfaction = 1
	#围城能力
	siege_ability = 20
	#每月稳定增长
	stability_investment = 5
	#谍报网建造速度
	spy_network_construction = 10
	#战争分数花费
	global_war_score_cost = -10
`;

// 读取difficulty.txt.bak文件内容并生成新的difficulty.txt文件
const fs = require('fs');
const path = require('path');

const bakFilePath = path.join(__dirname, 'difficulty.txt.bak');
const outputFilePath = path.join(__dirname, 'difficulty.txt');

try {
    // 读取bak文件内容
    const bakContent = fs.readFileSync(bakFilePath, 'utf8');
    
    // 追加difficulty_player_very_hard块的内容
    const updatedContent = bakContent.replace(
        /(difficulty_player_very_hard = \{[\s\S]*?)(^\})/m,
        `$1
${difficulty.trimEnd()}
$2`
    );
    
    // 写入新文件
    fs.writeFileSync(outputFilePath, updatedContent, 'utf8');
    console.log('Successfully generated difficulty.txt');
} catch (error) {
    console.error('Error generating difficulty.txt:', error);
}

