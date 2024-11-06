import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
    constructor() {
        this.hp = 100;
    }

    attack(monster, choice) {
        let success = false;
        switch (choice) {
            case '1': // 기본 공격
                console.log(chalk.green("플레이어가 기본 공격을 사용했습니다!"));
                monster.hp -= 10;
                console.log(`몬스터에게 ${this.attackPower}의 피해를 입혔습니다. 몬스터의 HP: ${monster.hp}`);
                break;
            case '2': // 강력한 공격 (50% 성공 확률)
                success = Math.random() < 0.5;
                if (success) {
                    console.log(chalk.green("플레이어가 강력한 공격을 성공했습니다!"));
                    monster.hp -= 20;
                    console.log(`몬스터에게 ${this.attackPower * 2}의 피해를 입혔습니다. 몬스터의 HP: ${monster.hp}`);
                } else {
                    console.log(chalk.yellow("플레이어의 강력한 공격이 실패했습니다."));
                }
                break;
            case '3': // 체력 회복 (30% 성공)
                success = Math.random() < 0.3;
                if (success) {
                    console.log(chalk.green("플레이어가 체력을 회복했습니다!"));
                    this.hp += 15;
                    console.log(`플레이어의 HP가 회복되었습니다. 플레이어의 HP: ${this.hp}`);
                } else {
                    console.log(chalk.yellow("플레이어의 체력 회복이 실패했습니다."))
                }
                break;
            default:
                console.log(chalk.yellow("잘못된 선택입니다. 기본 공격을 사용합니다."));
                monster.hp -= 10;
                console.log(`몬스터에게 10의 피해를 입혔습니다. 몬스터의 HP: ${monster.hp}`);
                break;
        }
    }
    levelUp() {
        // 레벨업 시 능력치 증가
        this.hp += 10; // 체력 증가
        this.attackPower += 5; // 공격력 증가
        console.log(chalk.blue(`플레이어의 능력치가 증가했습니다! HP: ${this.hp}, 공격력: ${this.attackPower}`));
    }
}

class Monster {
    constructor() {
        this.hp = 100;
    }

    attack(player) {
        const attackType = Math.floor(Math.random() * 2);
        switch (attackType) {
            case 0: // 기본 공격
                console.log(chalk.red("몬스터가 기본 공격을 사용했습니다!"));
                player.hp -= 8;
                console.log(`플레이어에게 8의 피해를 입혔습니다. 플레이어의 HP: ${player.hp}`);
                break;
            case 1: // 강력한 공격
                console.log(chalk.red("몬스터가 강력한 공격을 사용했습니다!"));
                player.hp -= 15;
                console.log(`플레이어에게 15의 피해를 입혔습니다. 플레이어의 HP: ${player.hp}`);
                break;
        }
    }
    levelUp(stage) {
        // 스테이지 클리어 시 몬스터의 능력치 증가
        this.hp += 20 + stage * 5; // 몬스터 체력 증가
        this.attackPower += 5 + stage; // 몬스터 공격력 증가
        console.log(chalk.red(`몬스터의 능력치가 증가했습니다! HP: ${this.hp}, 공격력: ${this.attackPower}`));
    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(`| 플레이어 HP: ${player.hp} `) +
        chalk.redBright(`| 몬스터 HP: ${monster.hp} |`)
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
    let logs = [];

    while (player.hp > 0 && monster.hp > 0) {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.green(`\n1. 기본 공격 (10의 피해)  2. 강력한 공격 (20의 피해)  3. 체력 회복 (+15)  4. 포기`)
        );
        const choice = readlineSync.question('당신의 선택은? ');

        if (choice === '4') {
            console.log(chalk.yellow("플레이어가 포기를 선택했습니다. 전투가 종료됩니다."));
            break;
        }

        // 플레이어의 공격 수행
        logs.push(chalk.green(`플레이어가 ${choice}번을 선택했습니다.`));
        player.attack(monster, choice);

        // 몬스터의 공격 수행 (몬스터가 살아있는 경우에만)
        if (monster.hp > 0) {
            monster.attack(player);
        }

        // 전투 종료 조건
        if (player.hp <= 0) {
            console.log(chalk.red("플레이어가 패배했습니다."));
            break;
        } else if (monster.hp <= 0) {
            console.log(chalk.green("몬스터를 물리쳤습니다!"));
            break;
        }
    }
};

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;

    while (stage <= 10) {
        const monster = new Monster();
        await battle(stage, player, monster);

        // 스테이지 클리어 및 게임 종료 조건
        if (player.hp <= 0) {
            console.log(chalk.red("게임 종료: 플레이어가 패배했습니다."));
            break;
        }

        console.log(chalk.green(`스테이지 ${stage}를 클리어했습니다! 다음 스테이지로 진행합니다.`));
        stage++;
    }
}
