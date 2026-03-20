// src/api/api.js
// 백엔드 API 서비스 레이어

const API_BASE_URL = 'http://192.168.10.116:8000';

/**
 * 날씨 선택지 목록을 백엔드에서 가져옵니다.
 * @returns {Promise<{options: Array<{value: string, label: string, emoji: string}>}>}
 */
export const getWeatherOptions = async () => {
    const response = await fetch(`${API_BASE_URL}/weather-options`);
    if (!response.ok) throw new Error('날씨 옵션을 불러오지 못했습니다.');
    return response.json();
};

/**
 * 일기 내용과 날씨를 바탕으로 AI 플레이리스트를 추천받습니다.
 * @param {Object} params
 * @param {string} params.weather - 날씨 값 (예: "맑음", "비")
 * @param {string} params.diary - 일기 본문
 * @param {number} [params.track_count=5] - 추천 트랙 수
 * @returns {Promise<{weather: string, tags: string[], tracks: Array}>}
 */
export const recommendPlaylist = async ({ weather, diary, track_count = 5 }) => {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weather, diary, track_count }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        // Pydantic 422 에러는 detail이 배열로 오므로 첫 번째 메시지 추출
        let message = '플레이리스트 추천에 실패했습니다.';
        if (error.detail) {
            if (Array.isArray(error.detail)) {
                message = error.detail.map(e => e.msg).join(', ');
            } else if (typeof error.detail === 'string') {
                message = error.detail;
            }
        }
        throw new Error(message);
    }
    return response.json();
};
