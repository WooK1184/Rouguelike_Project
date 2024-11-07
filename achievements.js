// achievements.js
import chalk from 'chalk';
import { getAchievements, updateAchievements } from './db.js';

// 초기 업적 설정 함수
function initializeAchievements() {
    const achievements = getAchievements();

    // 업적이 비어 있는 경우 기본 업적 목록 설정
    if (achievements.length === 0) {
        const initialAchievements = [
            { id: 1, name: '첫 게임 시작', description: '첫 번째 게임을 시작했습니다.', achieved: false },
            { id: 2, name: '100점 달성', description: '게임에서 100점을 달성했습니다.', achieved: false },
            { id: 3, name: '게임 10회 플레이', description: '게임을 10번 플레이했습니다.', achieved: false }
        ];
        updateAchievements(initialAchievements);
    }
}

// 업적을 확인하고 업데이트하는 함수
function checkAchievements(gameData) {
    const achievements = getAchievements();

    // 첫 게임 시작 업적 확인
    if (!achievements[0].achieved && gameData.startCount >= 1) {
        updateAchievements(1);
        console.log(chalk.green("축하합니다! '첫 게임 시작' 업적을 달성했습니다."));
    }

    // 100점 이상 달성 업적 확인
    if (!achievements[1].achieved && gameData.score >= 100) {
        updateAchievements(2);
        console.log(chalk.green("축하합니다! '100점 달성' 업적을 달성했습니다."));
    }

    // 10회 플레이 업적 확인
    if (!achievements[2].achieved && gameData.playCount >= 10) {
        updateAchievements(3);
        console.log(chalk.green("축하합니다! '게임 10회 플레이' 업적을 달성했습니다."));
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
