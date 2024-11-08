// db.js
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON 파일 경로 설정
const file = path.join(__dirname, 'db.json');
const adapter = new FileSync(file);
const db = low(adapter);

// 데이터베이스 초기화 함수
function initializeDB() {
    db.defaults({ achievements: [], gameData: { maxDamageHitCount: 0, startCount: 0, playCount: 0 } }).write();
}

// 게임 데이터를 가져오는 함수
function getGameData() {
    return db.get('gameData').value();
}

// 게임 데이터를 업데이트하는 함수
function updateGameData(data) {
    db.set('gameData', { ...getGameData(), ...data }).write();
}

// 업적 데이터를 가져오는 함수
function getAchievements() {
    return db.get('achievements').value();
}

// 업적 데이터를 업데이트하는 함수
function updateAchievements(updatedAchievements) {
    if (Array.isArray(updatedAchievements)) {
        // 전체 업적을 초기화하는 경우
        db.set('achievements', updatedAchievements).write();
    } else {
        // 특정 업적을 달성 상태로 업데이트하는 경우
        db.get('achievements')
            .find({ id: updatedAchievements })
            .assign({ achieved: true })
            .write();
    }
}

// 데이터베이스 초기화 실행
initializeDB();

export { getGameData, updateGameData, getAchievements, updateAchievements };
