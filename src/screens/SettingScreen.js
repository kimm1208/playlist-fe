import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Colors } from "../styles/theme";

export default function SettingScreen() {
    // 예시 데이터 (나중에 실제 데이터로 연결 가능)
    const userInfo = {
        name: "사용자",
        email: "knu_student@knu.ac.kr",
        major: "컴퓨터공학부",
    };

    const SettingItem = ({ title, value, isLink = true }) => (
        <TouchableOpacity style={styles.item} disabled={!isLink}>
            <View>
                <Text style={styles.itemTitle}>{title}</Text>
                {value && <Text style={styles.itemValue}>{value}</Text>}
            </View>
            {isLink && <Text style={styles.arrow}>〉</Text>}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            {/* 계정 정보 섹션 */}
            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Account</Text>
                <View style={styles.card}>
                    <SettingItem title="사용자 이름" value={userInfo.name} isLink={false} />
                    <SettingItem title="이메일" value={userInfo.email} isLink={false} />
                    <SettingItem title="소속" value={userInfo.major} isLink={false} />
                </View>
            </View>

            {/* 앱 설정 섹션 */}
            <View style={styles.section}>
                <Text style={styles.sectionLabel}>App Info</Text>
                <View style={styles.card}>
                    <SettingItem title="알림 설정" />
                    <SettingItem title="테마 변경" value="Electric Midnight" />
                    <SettingItem title="버전 정보" value="v1.0.4" isLink={false} />
                </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
    header: { marginBottom: 30, marginTop: 20 },
    headerTitle: { fontSize: 32, fontWeight: "800", color: Colors.text, letterSpacing: -1.5 },
    section: { marginBottom: 30 },
    sectionLabel: { fontSize: 14, fontWeight: "700", color: Colors.primary, marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' },
    card: { backgroundColor: Colors.secondary, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: Colors.border },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    itemTitle: { fontSize: 16, color: Colors.text, fontWeight: "600" },
    itemValue: { fontSize: 14, color: Colors.subText, marginTop: 4 },
    arrow: { color: Colors.subText, fontSize: 18 },
    logoutBtn: { marginTop: 10, padding: 20, alignItems: 'center' },
    logoutText: { color: "#FF4B4B", fontWeight: "700", fontSize: 16 }
});