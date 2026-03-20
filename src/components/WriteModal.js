// src/components/WriteModal.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Modal } from "react-native";
import { Colors, SharedStyles } from "../styles/theme";

export default function WriteModal({ onClose, onSave }) {
    const [entry, setEntry] = useState({
        title: "", content: "", mood: "😊",
        date: new Date().toISOString().split("T")[0],
    });

    const handlePressSave = () => {
        if (!entry.title || !entry.content) return Alert.alert("Empty", "Fill your story.");
        onSave(entry);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={true}>
            <View style={styles.modalOverlay}>
                <SafeAreaView style={styles.modalContent}>
                    {/* 모달 헤더 */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>New Log</Text>
                        <TouchableOpacity style={styles.saveBtn} onPress={handlePressSave}>
                            <Text style={styles.saveBtnText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 입력 영역 */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Title"
                            placeholderTextColor={Colors.subText}
                            value={entry.title}
                            onChangeText={(text) => setEntry({ ...entry, title: text })}
                        />

                        {/* 기분 선택 */}
                        <View style={styles.moodRow}>
                            {["😊", "😐", "😭", "😴"].map((m) => (
                                <TouchableOpacity key={m} onPress={() => setEntry({ ...entry, mood: m })} style={styles.moodItemFrame}>
                                    <Text style={[styles.moodItem, entry.mood === m && styles.moodSelected]}>{m}</Text>
                                    {entry.mood === m && <View style={styles.moodDot} />}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.contentInput}
                            multiline
                            placeholder="How was your day?"
                            placeholderTextColor={Colors.subText}
                            value={entry.content}
                            onChangeText={(text) => setEntry({ ...entry, content: text })}
                        />
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        ...SharedStyles.modalOverlay, // 딥 네이비 반투명 배경
    },
    modalContent: {
        flex: 1,
        padding: 24,
    },
    modalHeader: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        marginBottom: 40, height: 50
    },
    closeBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
    closeBtnText: { fontSize: 20, color: Colors.white },
    modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.white },
    saveBtn: {
        backgroundColor: Colors.primary, // 민트 버튼
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12
    },
    saveBtnText: { color: Colors.secondary, fontWeight: "700" }, // 다크 텍스트

    inputContainer: { flex: 1 },
    titleInput: {
        fontSize: 32, fontWeight: "800",
        marginBottom: 20, color: Colors.text,
        letterSpacing: -1,
    },
    moodRow: { flexDirection: "row", marginBottom: 30, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: 10 },
    moodItemFrame: { alignItems: 'center', marginRight: 20 },
    moodItem: { fontSize: 24, opacity: 0.2 },
    moodSelected: { opacity: 1, transform: [{ scale: 1.1 }] },
    moodDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 4 },

    contentInput: {
        flex: 1, fontSize: 17, textAlignVertical: "top", color: Colors.text,
        lineHeight: 26
    }
});