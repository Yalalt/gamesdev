const SCORES_KEY = 'subwaySurfers_scores';
const NAME_KEY = 'subwaySurfers_playerName';
const SETTINGS_KEY = 'subwaySurfers_settings';

export default class StorageManager {
    static getPlayerName() {
        return localStorage.getItem(NAME_KEY) || null;
    }

    static setPlayerName(name) {
        localStorage.setItem(NAME_KEY, name);
    }

    static saveScore(name, score) {
        const scores = StorageManager.getTopScores(100);
        scores.push({
            name,
            score,
            date: new Date().toISOString().split('T')[0]
        });
        scores.sort((a, b) => b.score - a.score);
        const top = scores.slice(0, 10);
        localStorage.setItem(SCORES_KEY, JSON.stringify(top));
        return top;
    }

    static getTopScores(limit = 10) {
        const raw = localStorage.getItem(SCORES_KEY);
        if (!raw) return [];
        try {
            const scores = JSON.parse(raw);
            return scores.slice(0, limit);
        } catch {
            return [];
        }
    }

    static getHighScore() {
        const scores = StorageManager.getTopScores(1);
        return scores.length > 0 ? scores[0].score : 0;
    }

    static getSettings() {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { soundEnabled: true };
        try {
            return JSON.parse(raw);
        } catch {
            return { soundEnabled: true };
        }
    }

    static saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
}
