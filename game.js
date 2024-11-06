import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
    constructor() {
        this.hp = 100;
        this.maxHp = 100;
        //this.attackSucces = 0.7 차후 게임 난이도 쉬울 경우 기본 베기도 확률 추가
        this.attackPowerMin = 8;
        this.attackPowerMax = 12;
        this.powerAttackSuccess = 0.3;
        this.healsuccess = 0.5;
    }

    randomAttackPower() {
        // 최소와 최대 공격력 사이의 랜덤 값 반환
        return Math.floor(
            Math.random() * (this.attackPowerMax - this.attackPowerMin + 1) + this.attackPowerMin);
    }

    attack(tree, choice) {
        let success = false;
        let attackPower = this.randomAttackPower();
        switch (choice) {
            case '1': // 기본 베기
                console.log(chalk.green("플레이어가 베기를 사용했습니다!"));
                tree.hp -= attackPower;
                if (tree.hp < 0) {
                    tree.hp = 0;
                }
                console.log(`나무가 ${attackPower}만큼 베어졌습니다. 나무의 HP: ${tree.hp}`);
                break;
            case '2': // 톱질 하기
                success = Math.random() < this.powerAttackSuccess;
                if (success) {
                    console.log(chalk.green("플레이어가 톱질을 성공했습니다!"));
                    tree.hp -= attackPower * 2
                    console.log(`나무가 ${attackPower * 2}만큼 베어졌습니다. 나무의 HP: ${tree.hp}`);
                } else {
                    console.log(chalk.yellow("플레이어의 톱질이 실패했습니다."));
                }
                break;
            case '3': // 체력 회복 (30% 성공)
                success = Math.random() < this.healsuccess;
                if (success) {
                    console.log(chalk.green("플레이어가 체력을 회복했습니다!"));
                    this.hp += 15;
                    if (this.hp > this.maxHp) this.hp = this.maxHp;
                    console.log(`플레이어의 체력 15만큼 회복되었습니다. 플레이어의 HP: ${this.hp}`);
                } else {
                    console.log(chalk.yellow("플레이어의 체력 회복이 실패했습니다."))
                }
                break;
            default:
                console.log(chalk.yellow("잘못된 선택입니다. 기본 공격을 사용합니다."));
                tree.hp -= 10;
                console.log(`나무가 ${attackPower}만큼 베어졌습니다. 나무의 HP: ${tree.hp}`);
                break;
        }
    }
    levelUp() {
        // 레벨업 시 능력치 증가
        this.maxHp += 15; // 체력 증가
        this.resetPlayerHpAfterStage();
        this.PlayerAttackPowerAfterStage(); //베기 파워 증가
        //this.attackSuccess += 0.05; //추후 베기 확률 증가 추가 가능
        this.powerAttackSuccess = Math.min(this.powerAttackSuccess + 0.05, 1)
        this.healsuccess = Math.min(this.healsuccess + 0.03, 1)
        console.log(chalk.blue(`플레이어의 능력치가 증가했습니다! HP: ${this.hp}, 벌목 파워: ${this.attackPowerMin} - ${this.attackPowerMax}`));
    }
    resetPlayerHpAfterStage() {
        this.hp = this.maxHp;
    }
    PlayerAttackPowerAfterStage() {
        this.attackPowerMin += 5
        this.attackPowerMax += 5
    }
}

class Tree {
    constructor() {
        this.hp = 100;
        this.maxHp = 100;
        this.attackPower = 5
    }

    attack(player) {
        const attackType = Math.floor(Math.random() * 2);
        switch (attackType) {
            case 0: // 기본 체력 감소
                console.log(chalk.red("플레이어의 체력이 감소했습니다."));
                player.hp -= this.attackPower;
                console.log(`플레이어의 체력이 ${this.attackPower}만큼 감소했습니다. 플레이어의 HP: ${player.hp}`);
                break;
            case 1: // 급격한 체력 감소
                console.log(chalk.red("플레이어의 체력이 크게 감소했습니다."));
                player.hp -= this.attackPower * 2;
                console.log(`플레이어의 체력이 ${this.attackPower * 2}만큼 감소했습니다. 플레이어의 HP: ${player.hp}`);
                break;
        }
    }
    levelUp() {
        // 스테이지 클리어 시 나무의 크기 증가
        this.maxHp += 20;
        this.attackPower += 5;
        this.resetTreeHpAfterStage();
        console.log(chalk.red(`나무의 크기가 증가했습니다. HP: ${this.hp}, 벌목 시 감소 HP: ${this.attackPower}`));
    }
    resetTreeHpAfterStage() {
        this.hp = this.maxHp;
    }
}

function displayStatus(stage, player, tree) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(`| 플레이어 HP: ${player.hp} `) +
        chalk.redBright(`| 나무 HP: ${tree.hp} |`)
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

const battle = (stage, player, tree) => {
    let logs = [];

    while (player.hp > 0 && tree.hp > 0) {
        console.clear();
        displayStatus(stage, player, tree);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.green(`\n1. 베기  2. 톱질하기(${Math.round(player.powerAttackSuccess * 100)}%)  3. 체력 회복(${Math.round(player.healsuccess * 100)}%)  4. 포기하기`)
        );
        const choice = readlineSync.question('당신의 선택은? ');
        
        if (choice === '4') {
            console.log(chalk.yellow("플레이어가 포기를 선택했습니다. 벌목이 종료됩니다."));
            return 'reset';
        }

        // 플레이어의 벌목 수행
        logs.push(chalk.green(`플레이어가 ${choice}번을 선택했습니다.`));
        player.attack(tree, choice);

        // 플레이어의 체력 감소 로직
        if (tree.hp > 0) {
            tree.attack(player);
        }

        // 벌목 종료 조건
        if (player.hp <= 0) {
            console.log(chalk.red("플레이어가 쓰러졌습니다."));
            break;
        } else if (tree.hp <= 0) {
            console.log(chalk.green("나무가 베어졌습니다!"));
            break;
        }

        readlineSync.question('');
    }

    return 'continue';
};

export async function startGame() {
    let playAgain = true;

    while (playAgain) {
        console.clear();
        const player = new Player();
        const tree = new Tree();
        let stage = 1;

        while (stage <= 10) {
            

            // battle 함수에서 반환값 처리
            const result = battle(stage, player, tree);

            if (result === 'reset') {
                // 게임을 처음부터 다시 시작하도록 설정
                //console.clear();
                console.log(chalk.green("게임이 처음부터 다시 시작됩니다."));
                break; // 처음부터 다시 시작
            }

            // 스테이지 클리어 및 게임 종료 조건
            if (player.hp <= 0) {
                console.log(chalk.red("게임 종료: 플레이어가 쓰러졌습니다."));
                break;
            }

            console.log(chalk.green(`스테이지 ${stage}를 클리어했습니다! 다음 스테이지로 진행합니다.`));
            player.levelUp(); // 레벨업 및 체력 리셋
            tree.levelUp();
            readlineSync.question('다음을 스테이지로 넘어가주세요!');
            stage++;
        }

        console.log(chalk.green("게임이 종료되었습니다."));
        const restart = readlineSync.question("게임을 다시 시작하시겠습니까? (y/n): ");
        if (restart.toLowerCase() !== 'y') {
            playAgain = false;
        }
    }
}