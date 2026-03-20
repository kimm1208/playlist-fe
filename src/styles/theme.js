// src/styles/theme.js
export const Colors = {
    primary: "#3FFFB2",      // 일렉트릭 민트
    secondary: "#1A212E",    // 딥 네이비 (메인 카드 배경)
    background: "#0F1219",   // 아주 어두운 자정색 (전체 배경)

    text: "#FFFFFF",         // 화이트 텍스트
    subText: "#A0AEC0",      // 그레이 텍스트

    glass: "rgba(255, 255, 255, 0.05)", // 반투명 요소
    border: "rgba(63, 255, 178, 0.2)",  // 민트색 반투명 테두리
};

export const SharedStyles = {
    shadow: {
        // 그림자를 최소화하여 '플랫'하고 모던하게
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 1,
    },
    modalOverlay: {
        backgroundColor: "rgba(26, 33, 46, 0.95)", // 다크한 모달 배경
    }
};