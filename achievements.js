// achievements.js
import chalk from 'chalk';
import { getAchievements, getInventory, updateAchievements, weaponInventory } from './db.js';

// 초기 업적 설정 함수
function initializeAchievements() {
    const achievements = getAchievements();

    // 업적이 비어 있는 경우 기본 업적 목록 설정
    const initialAchievements = [
        { id: 1, name: '첫 게임 시작', description: '첫 번째 게임을 시작했습니다.', achieved: false },
        { id: 2, name: '로또 당첨!', description: '게임에서 3연속 맥스데미지를 주었습니다.', achieved: false },  // 이름 변경
        { id: 3, name: '게임 3회 플레이', description: '게임을 3번 플레이했습니다.', achieved: false }
    ];

    if (achievements.length === 0) {
        // 업적이 비어 있으면 초기 업적 목록을 설정
        updateAchievements(initialAchievements);
    } else {
        // 기존 업적과 비교하여 업데이트
        const updatedAchievements = achievements.map(ach => {
            const initial = initialAchievements.find(init => init.id === ach.id);
            return initial ? { ...ach, ...initial } : ach;  // 초기 업적 정보로 덮어씌움
        });
        updateAchievements(updatedAchievements);
    }
}

// 업적을 확인하고 업데이트하는 함수
function checkAchievements(gameData) {
    const achievements = getAchievements();

    // 첫 게임 시작 업적 확인
    if (!achievements[0].achieved && gameData.startCount >= 1) {
        updateAchievements(1);
        console.log(chalk.green("축하합니다! '첫 게임 시작' 업적을 달성했습니다."));

        const goldenAxe = { id: 'goldenAxe', name: '쇠도끼', minAttack: 8, maxAttack: 12 };
        weaponInventory(goldenAxe);
    }

    // 맥스데이지 3회 달성 업적 확인
    if (!achievements[1].achieved && gameData.maxDamageHitCount >= 3) {
        updateAchievements(2);
        console.log(chalk.green("축하합니다! '로또 당첨!' 업적을 달성했습니다. 금도끼를 얻었습니다!"));

        const goldenAxe = { id: 'goldenAxe', name: '금도끼', minAttack: 18, maxAttack: 22 };
        weaponInventory(goldenAxe);
    }

    // 3회 플레이 업적 확인
    if (!achievements[2].achieved && gameData.playCount >= 3) {
        updateAchievements(3);
        console.log(chalk.green("축하합니다! '게임 3회 플레이' 업적을 달성했습니다. 은도끼를 얻었습니다!"));
        
        const silverAxe = { id: 'silverAxe', name: '은도끼', minAttack: 13, maxAttack: 17 };
        weaponInventory(silverAxe)
    }
}

// 업적 목록을 표시하는 함수
function displayAchievements() {
    const achievements = getAchievements();
    console.clear();
    console.log(chalk.magentaBright('=== 업적 목록 ==='));
    achievements.forEach(ach => {
        const status = ach.achieved ? chalk.green('달성') : chalk.red('미달성');
        console.log(`${chalk.yellow(ach.name)} - ${ach.description} [${status}]`);
    });
    console.log(chalk.magentaBright('================='));
}

// 초기 업적 설정 실행
initializeAchievements();

export { checkAchievements, displayAchievements };
