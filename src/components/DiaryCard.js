// src/components/DiaryCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { Colors } from "../styles/theme";

export default function DiaryCard({ item, onPress }) {
    const firstTrack = item.playlist && item.playlist.length > 0 ? item.playlist[0] : null;
    const trackName = firstTrack ? firstTrack.title : (item.music || "No track");

    return (
        <TouchableOpacity style={styles.diaryCard} onPress={() => onPress(item)} activeOpacity={0.7}>
            <View style={styles.cardLeft}>
                <View style={styles.cardTop}>
                    <Text style={styles.dateText}>{item.date.toUpperCase()}</Text>
                    <View style={styles.moodBadge}>
                        <Text style={styles.moodEmoji}>{item.mood}</Text>
                    </View>
                </View>
                <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.contentText} numberOfLines={2}>{item.content}</Text>
            </View>

            {/* 음악 재생 영역을 다크 스퀘어로 모던하게 */}
            <TouchableOpacity
                style={styles.cardRight}
                onPress={() => Alert.alert("Play", trackName)}
                activeOpacity={0.8}
            >
                {firstTrack?.cover_url
                    ? <Image source={{ uri: firstTrack.cover_url }} style={styles.albumImage} />
                    : <Text style={styles.albumIcon}>💿</Text>
                }
                <View style={styles.playBar} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    diaryCard: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24, // 여백 확대
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border, // 그림자 대신 얇은 선
    },
    cardLeft: { flex: 1, paddingRight: 20 },
    cardTop: { flexDirection: "row", alignItems: "center", justifyContent: 'space-between', marginBottom: 12 },
    dateText: { color: Colors.subText, fontSize: 12, fontWeight: "700", letterSpacing: 1 },
    moodBadge: {
        width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.card,
        justifyContent: 'center', alignItems: 'center'
    },
    moodEmoji: { fontSize: 16 },
    titleText: { fontSize: 20, fontWeight: "700", color: Colors.text, marginBottom: 6, letterSpacing: -0.5 },
    contentText: { color: Colors.subText, fontSize: 14, lineHeight: 20 },
    cardRight: {
        width: 70, height: 70,
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        alignItems: "center", justifyContent: "center",
        alignSelf: 'center',
        overflow: 'hidden',
    },
    albumIcon: { fontSize: 28 },
    albumImage: { width: 70, height: 70, borderRadius: 15 },
    playBar: {
        width: 30, height: 3, backgroundColor: Colors.primary, // 민트 포인트
        borderRadius: 2, marginTop: 8
    }
});
