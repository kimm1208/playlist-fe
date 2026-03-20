import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform
} from "react-native";

import { Colors } from "../styles/theme";

const { width } = Dimensions.get("window");

export default function NavBar({ currentView, setCurrentView, onWritePress }) {
    const NavItem = ({ view, icon, label }) => (
        <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentView(view)}
            activeOpacity={0.6}
        >
            <Text style={[styles.navIcon, currentView === view && styles.navActive]}>{icon}</Text>
            {currentView === view && <View style={styles.activeDot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.navBar}>
            <View style={styles.navContent}>
                <NavItem view="diary" icon="📝" label="Log" />
                <NavItem view="calendar" icon="📅" label="Timeline" />

                {/* 작성 버튼 */}
                <TouchableOpacity style={styles.writeBtn} onPress={onWritePress} activeOpacity={0.8}>
                    <Text style={styles.writeBtnText}>+</Text>
                </TouchableOpacity>

                <NavItem view="playlist" icon="🎵" label="Beat" />
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => setCurrentView("settings")} // 1. 클릭 시 뷰 전환 로직 추가
                    activeOpacity={0.6}
                >
                    <Text style={[
                        styles.navIcon,
                        currentView === "settings" && styles.navActive // 2. 활성화 시 색상 변경 로직 추가
                    ]}>
                        ⚙️
                    </Text>
                    {/* 3. 활성화 시 아래 민트색 점 표시 */}
                    {currentView === "settings" && <View style={styles.activeDot} />}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        position: "absolute",
        bottom: 0,
        width: width,
        // 핵심 수정 포인트: 
        // 기기 하단 버튼 영역을 피하기 위해 높이를 키우고 하단 패딩을 추가합니다.
        height: Platform.OS === 'ios' ? 100 : 85,
        paddingBottom: Platform.OS === 'ios' ? 30 : 15, // 스마트폰 버튼 위로 띄우는 여백
        backgroundColor: Colors.secondary,
        borderTopWidth: 1,
        borderTopColor: "rgba(63, 255, 178, 0.3)",
        zIndex: 1000,
        elevation: 25,

        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
        justifyContent: 'center', // 세로 중앙 정렬
        // 그림자 추가로 영역 구분 명확히
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    navContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        width: '100%'
    },
    navItem: { alignItems: "center", width: 50, height: 40, justifyContent: 'center' },
    navIcon: { fontSize: 22, color: Colors.subText },
    navActive: { color: Colors.secondary, fontSize: 24 },
    activeDot: {
        width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 4
    },
    writeBtn: {
        width: 56, height: 56, borderRadius: 16,
        backgroundColor: Colors.secondary,
        justifyContent: "center", alignItems: "center",
        marginTop: -45, // 버튼이 바 위로 살짝 더 올라오게 조정
        shadowColor: Colors.secondary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    writeBtnText: { color: Colors.primary, fontSize: 32, fontWeight: "300" },
});