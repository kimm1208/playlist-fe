// src/components/WriteModal.js
import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    SafeAreaView, Alert, Modal, ScrollView, ActivityIndicator,
    KeyboardAvoidingView, Platform
} from "react-native";
import { Colors, SharedStyles } from "../styles/theme";
import { getWeatherOptions, recommendPlaylist } from "../api/api";

const DEFAULT_WEATHER_OPTIONS = [
    { value: "맑음", label: "맑음", emoji: "☀️" },
    { value: "흐림", label: "흐림", emoji: "☁️" },
    { value: "비",   label: "비",   emoji: "🌧️" },
    { value: "눈",   label: "눈",   emoji: "❄️" },
    { value: "바람", label: "바람", emoji: "🌬️" },
    { value: "폭풍", label: "폭풍", emoji: "⛈️" },
    { value: "안개", label: "안개", emoji: "🌫️" },
    { value: "더움", label: "더움", emoji: "🔥" },
    { value: "추움", label: "추움", emoji: "🧊" },
];

const MOODS = [
    { emoji: "😊", label: "좋음" },
    { emoji: "😐", label: "보통" },
    { emoji: "😭", label: "슬픔" },
    { emoji: "😴", label: "피곤" },
];

export default function WriteModal({ onClose, onSave, initialDate }) {
    const [entry, setEntry] = useState({
        title: "",
        content: "",
        mood: "😊",
        weather: "맑음",
        date: initialDate || new Date().toISOString().split("T")[0],
    });
    const [weatherOptions, setWeatherOptions] = useState(DEFAULT_WEATHER_OPTIONS);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getWeatherOptions()
            .then(data => setWeatherOptions(data.options.map(o => ({
                ...o,
                // fallback emoji 매핑
                emoji: DEFAULT_WEATHER_OPTIONS.find(d => d.value === o.value)?.emoji || o.emoji,
            }))))
            .catch(() => setWeatherOptions(DEFAULT_WEATHER_OPTIONS));
    }, []);

    const handlePressSave = async () => {
        if (!entry.title || !entry.content) {
            return Alert.alert("내용을 채워주세요", "제목과 일기 내용을 입력해주세요.");
        }
        if (entry.content.length < 5) {
            return Alert.alert("일기가 너무 짧아요", "5글자 이상 작성해주세요.");
        }
        setIsLoading(true);
        try {
            const result = await recommendPlaylist({
                weather: entry.weather,
                diary: entry.content,
                track_count: 5,
            });
            onSave({ ...entry, tags: result.tags, playlist: result.tracks });
        } catch (e) {
            Alert.alert("플레이리스트 추천 실패", e.message || "나중에 다시 시도해주세요.");
            onSave({ ...entry, tags: [], playlist: [] });
        } finally {
            setIsLoading(false);
        }
    };

    const displayDate = entry.date.replace(/-/g, ". ");

    return (
        <Modal animationType="slide" transparent={true} visible={true}>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
                <SafeAreaView style={styles.container}>

                    {/* 헤더 */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isLoading}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle}>New Log</Text>
                            <Text style={styles.headerDate}>{displayDate}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
                            onPress={handlePressSave}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <ActivityIndicator size="small" color={Colors.secondary} />
                                : <Text style={styles.saveBtnText}>Save</Text>
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <ScrollView
                        style={styles.scroll}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* 제목 */}
                        <TextInput
                            style={styles.titleInput}
                            placeholder="제목을 입력하세요"
                            placeholderTextColor={'rgba(255,255,255,0.2)'}
                            value={entry.title}
                            onChangeText={(text) => setEntry({ ...entry, title: text })}
                            editable={!isLoading}
                        />

                        <View style={styles.divider} />

                        {/* 기분 선택 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>기분</Text>
                            <View style={styles.moodRow}>
                                {MOODS.map((m) => (
                                    <TouchableOpacity
                                        key={m.emoji}
                                        onPress={() => setEntry({ ...entry, mood: m.emoji })}
                                        style={[styles.moodBtn, entry.mood === m.emoji && styles.moodBtnSelected]}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.moodEmoji}>{m.emoji}</Text>
                                        <Text style={[styles.moodLabel, entry.mood === m.emoji && styles.moodLabelSelected]}>
                                            {m.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 날씨 선택 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>오늘의 날씨</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.weatherRow}
                            >
                                {weatherOptions.map((w) => (
                                    <TouchableOpacity
                                        key={w.value}
                                        onPress={() => setEntry({ ...entry, weather: w.value })}
                                        style={[styles.weatherBtn, entry.weather === w.value && styles.weatherBtnSelected]}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.weatherEmoji}>{w.emoji}</Text>
                                        <Text style={[styles.weatherLabel, entry.weather === w.value && styles.weatherLabelSelected]}>
                                            {w.value}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 일기 내용 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>오늘의 기록</Text>
                            <View style={styles.contentBox}>
                                <TextInput
                                    style={styles.contentInput}
                                    multiline
                                    placeholder="오늘 하루는 어땠나요?"
                                    placeholderTextColor={'rgba(255,255,255,0.2)'}
                                    value={entry.content}
                                    onChangeText={(text) => setEntry({ ...entry, content: text })}
                                    editable={!isLoading}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        {/* AI 로딩 배너 */}
                        {isLoading && (
                            <View style={styles.loadingBanner}>
                                <ActivityIndicator size="small" color={Colors.primary} />
                                <Text style={styles.loadingText}>AI가 플레이리스트를 만들고 있어요...</Text>
                            </View>
                        )}

                        <View style={{ height: 40 }} />
                    </ScrollView>

                </SafeAreaView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
    },

    // 헤더
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    closeBtn: {
        width: 36, height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center', alignItems: 'center',
    },
    closeBtnText: { fontSize: 14, color: Colors.subText },
    headerCenter: { alignItems: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
    headerDate: { fontSize: 11, color: Colors.primary, marginTop: 2, fontWeight: '600' },
    saveBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20, paddingVertical: 9,
        borderRadius: 20, minWidth: 64, alignItems: 'center',
    },
    saveBtnDisabled: { opacity: 0.5 },
    saveBtnText: { color: Colors.secondary, fontWeight: "800", fontSize: 14 },

    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginHorizontal: 0,
    },

    // 스크롤
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 40, flexGrow: 1 },

    // 제목
    titleInput: {
        fontSize: 28, fontWeight: "800",
        color: Colors.text, letterSpacing: -0.5,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
        minHeight: 80,
    },

    // 섹션 공통
    section: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 8,
    },
    sectionLabel: {
        fontSize: 11, fontWeight: '700',
        color: Colors.primary,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 14,
    },

    // 기분
    moodRow: {
        flexDirection: 'row',
        gap: 10,
    },
    moodBtn: {
        flex: 1, alignItems: 'center', paddingVertical: 14,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        borderWidth: 1, borderColor: 'transparent',
    },
    moodBtnSelected: {
        backgroundColor: 'rgba(63,255,178,0.08)',
        borderColor: Colors.primary,
    },
    moodEmoji: { fontSize: 26, marginBottom: 6 },
    moodLabel: { fontSize: 11, color: Colors.subText, fontWeight: '600' },
    moodLabelSelected: { color: Colors.primary },

    // 날씨
    weatherRow: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
    weatherBtn: {
        alignItems: 'center',
        paddingVertical: 12, paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        borderWidth: 1, borderColor: 'transparent',
        minWidth: 62,
    },
    weatherBtnSelected: {
        backgroundColor: 'rgba(63,255,178,0.08)',
        borderColor: Colors.primary,
    },
    weatherEmoji: { fontSize: 24, marginBottom: 5 },
    weatherLabel: { fontSize: 11, color: Colors.subText, fontWeight: '600' },
    weatherLabelSelected: { color: Colors.primary },

    // 내용
    contentBox: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        padding: 16,
        minHeight: 160,
    },
    contentInput: {
        fontSize: 16, color: Colors.text,
        lineHeight: 26, minHeight: 140,
    },

    // 로딩
    loadingBanner: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 24, marginTop: 16,
        backgroundColor: 'rgba(63,255,178,0.06)',
        borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: Colors.border,
    },
    loadingText: {
        color: Colors.primary, marginLeft: 12,
        fontSize: 14, fontWeight: '600',
    },
});
