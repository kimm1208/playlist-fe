import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Colors } from "../styles/theme";

export default function DiaryScreen({ diaries, searchQuery, onDiaryPress }) {
    // 실제 사용자 이름 (예시)
    const userName = "사용자";
    const filteredDiaries = diaries.filter(d =>
        d.title.includes(searchQuery) || d.content.includes(searchQuery)
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* 사용자 정보 섹션 */}
            <View style={styles.userSection}>
                <Text style={styles.welcomeText}>안녕하세요,</Text>
                <Text style={styles.nameText}>{userName}님</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{diaries.length}</Text>
                        <Text style={styles.statLabel}>Total Logs</Text>
                    </View>
                    {/* 일렉트릭 디자인 요소: 장식용 그라데이션 라인 */}
                    <View style={styles.electricLine} />
                </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Path</Text>
            {filteredDiaries.map((item) => (
                <TouchableOpacity key={item.id} style={styles.logCard} onPress={() => onDiaryPress(item)} activeOpacity={0.7}>
                    <Text style={styles.logDate}>{item.date}</Text>
                    <Text style={styles.logTitle}>{item.title}</Text>
                    <View style={styles.logFooter}>
                        <Text style={styles.logMood}>{item.mood}</Text>
                        <Text style={styles.logMusic}>
                            🎧 {(item.playlist && item.playlist[0]) ? item.playlist[0].title : (item.music || "—")}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 24, paddingBottom: 120 },
    userSection: { marginBottom: 40, marginTop: 20 },
    welcomeText: { fontSize: 24, color: Colors.subText, fontWeight: "300" },
    nameText: { fontSize: 36, color: Colors.text, fontWeight: "800", marginTop: 4 },
    statsRow: { marginTop: 20, flexDirection: 'row', alignItems: 'center' },
    statCard: {
        backgroundColor: Colors.secondary, padding: 20, borderRadius: 24,
        borderWidth: 1, borderColor: Colors.border, width: '45%'
    },
    statNumber: { fontSize: 28, fontWeight: "800", color: Colors.primary },
    statLabel: { fontSize: 12, color: Colors.subText, marginTop: 4, fontWeight: "600" },
    electricLine: {
        flex: 1, height: 2, backgroundColor: Colors.primary, marginLeft: 20,
        shadowColor: Colors.primary, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5
    },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: Colors.text, marginBottom: 15 },
    logCard: {
        backgroundColor: Colors.glass, borderRadius: 20, padding: 20, marginBottom: 12,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.05)"
    },
    logDate: { fontSize: 12, color: Colors.primary, fontWeight: "700", marginBottom: 8 },
    logTitle: { fontSize: 18, color: Colors.text, fontWeight: "600" },
    logFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    logMood: { fontSize: 16 },
    logMusic: { color: Colors.subText, fontSize: 13 }
});