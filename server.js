import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { startGame } from "./game.js";
import { displayAchievements, checkAchievements } from "./achievements.js";
import { getGameData, updateGameData, displayInventory } from './db.js';

// 게임 데이터를 초기화
let gameData = {
    maxDamageHitCount: 0,
    startCount: 0,
    playCount: 0
};

// 로비 화면을 출력하는 함수
export function displayLobby() {
    console.clear();
    gameData.startCount += 1;

    // 타이틀 텍스트
    console.log(
        chalk.white(
            figlet.textSync('Tree Slayer', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 이름
    console.log(chalk.yellowBright.bold('Tree Slayer!'));

    // 설명 텍스트
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
    console.log(chalk.blue('2.') + chalk.white(' 업적 확인하기'));
    console.log(chalk.blue('3.') + chalk.white(' 인벤토리'));
    console.log(chalk.blue('4.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

// 유저 입력을 받아 처리하는 함수
export async function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {
        case '1':
            console.log(chalk.green('게임을 시작합니다.'));

            // 게임 시작 시 게임 데이터 업데이트
            gameData.playCount += 1;
            updateGameData(gameData);

            // 게임 데이터를 저장하고 업적 조건 확인
            updateGameData(gameData);
            checkAchievements(gameData);
            const result = await startGame();
            if (result === 'reset') {
                displayLobby();  // 게임을 포기하고 로비로 돌아가기
                await handleUserInput();  // 다시 유저 입력 받기
            }
            break;

        case '2':
            // 업적 확인하기 화면
            displayAchievements();
            readlineSync.question('\n처음으로 돌아가려면 Enter 키를 누르세요.');
            displayLobby();
            await handleUserInput();
            break;

        case '3':
            displayInventory();
            readlineSync.question('\n처음으로 돌아가려면 Enter 키를 누르세요.');
            displayLobby();
            await handleUserInput();
            break;

        case '4':
            console.log(chalk.red('게임을 종료합니다.'));
            process.exit(0); // 게임 종료
            break;

        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            await handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}

// 게임 시작 함수
async function start() {
    // 데이터베이스에서 초기 게임 데이터를 가져옴
    gameData = await getGameData();

    displayLobby();
    await handleUserInput();
}

// 게임 실행
start();
