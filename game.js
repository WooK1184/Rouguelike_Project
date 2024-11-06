import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
    constructor() {
        this.hp = 100;
        //this.attackSucces = 0.7 차후 게임 난이도 쉬울 경우 기본 베기도 확률 추가
        this.attackPower = 10;
        this.powerAttackSucces = 0.3
        this.healsucces = 0.5
    }

    attack(tree, choice) {
        let success = false;
        switch (choice) {
            case '1': // 기본 베기
                console.log(chalk.green("플레이어가 기본 공격을 사용했습니다!"));
                tree.hp -= this.attackPower;
                console.log(`나무가 ${this.attackPower}만큼 베어졌습니다. 나무의 HP: ${tree.hp}`);
                break;
            case '2': // 톱질 하기
                success = Math.random() < this.powerAttackSucces;
                if (success) {
                    console.log(chalk.green("플레이어가 강력한 공격을 성공했습니다!"));
                    tree.hp -= this.attackPower * 2
                    console.log(`나무가 ${this.attackPower * 2}만큼 베어졌습니다. 나무의 HP: ${tree.hp}`);
                } else {
                    console.log(chalk.yellow("플레이어의 강력한 공격이 실패했습니다."));
                }
                break;
            case '3': // 체력 회복 (30% 성공)
                success = Math.random() < this.healsucces;
                if (success) {
                    console.log(chalk.green("플레이어가 체력을 회복했습니다!"));
                    this.hp += 15;
                    console.log(`플레이어의 체력 15만큼 회복되었습니다. 플레이어의 HP: ${this.hp}`);
                } else {
                    console.log(chalk.yellow("플레이어의 체력 회복이 실패했습니다."))
                }
                break;
            default:
                console.log(chalk.yellow("잘못된 선택입니다. 기본 공격을 사용합니다."));
                tree.hp -= 10;
                console.log(`나무가 ${this.attackPower}만큼 베어졌습니다. 나무의 HP: ${tree.hp}`);
                break;
        }
    }
    levelUp() {
        // 레벨업 시 능력치 증가
        this.hp += 10; // 체력 증가
        this.attackPower += 5; //베기 파워 증가
        //this.attackSucces += 0.05; //추후 베기 확률 증가 추가 가능
        this.powerAttackSucces += 0.05
        this.healsucces += 0.03
        console.log(chalk.blue(`플레이어의 능력치가 증가했습니다! HP: ${this.hp}, 벌목 파워: ${this.attackPower}`));
    }
}

class Tree {
    constructor() {
        this.hp = 100;
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
    levelUp(stage) {
        // 스테이지 클리어 시 나무의 크기 증가
        this.hp += 20 + stage * 5;
        this.attackPower += 5 + stage;
        console.log(chalk.red(`나무의 크기가 증가했습니다. HP: ${this.hp}, 벌목 시 감소 HP: ${this.attackPower}`));
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

const battle = async (stage, player, tree) => {
    let logs = [];

    while (player.hp > 0 && tree.hp > 0) {
        console.clear();
        displayStatus(stage, player, tree);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.green(`\n1. 베기  2. 톱질하기  3. 체력 회복  4. 포기하기`)
        );
        const choice = readlineSync.question('당신의 선택은? ');

        if (choice === '4') {
            console.log(chalk.yellow("플레이어가 포기를 선택했습니다. 벌목이 종료됩니다."));
            break;
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
    }
};

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;

    while (stage <= 10) {
        const tree = new Tree();
        await battle(stage, player, tree);

        // 스테이지 클리어 및 게임 종료 조건
        if (player.hp <= 0) {
            console.log(chalk.red("게임 종료: 플레이어가 쓰러졌습니다."));
            break;
        }

        console.log(chalk.green(`스테이지 ${stage}를 클리어했습니다! 다음 스테이지로 진행합니다.`));
        stage++;
    }
}
