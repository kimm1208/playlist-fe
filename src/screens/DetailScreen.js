import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Linking, Alert } from "react-native";
import { Audio } from "expo-av";
import { Colors } from "../styles/theme";

export default function DetailScreen({ diary, onBack, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(diary.content);
    const [playingIndex, setPlayingIndex] = useState(null);
    const soundRef = useRef(null);

    // 컴포넌트 언마운트 시 오디오 정리
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const handleSave = () => {
        onUpdate(diary.id, editedContent);
        setIsEditing(false);
    };

    const stopCurrent = async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
        }
        setPlayingIndex(null);
    };

    const handlePlayPress = async (track, index) => {
        // 같은 트랙 누르면 정지
        if (playingIndex === index) {
            await stopCurrent();
            return;
        }

        // 다른 트랙 재생 중이면 먼저 정지
        await stopCurrent();

        // 미리듣기 URL이 있으면 재생, 없으면 Apple Music으로 이동
        if (track.preview_url) {
            try {
                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                setPlayingIndex(index);
                const { sound } = await Audio.Sound.createAsync(
                    { uri: track.preview_url },
                    { shouldPlay: true }
                );
                soundRef.current = sound;
                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.didJustFinish) {
                        soundRef.current = null;
                        setPlayingIndex(null);
                    }
                });
            } catch (e) {
                setPlayingIndex(null);
                Alert.alert("재생 실패", "미리듣기를 재생할 수 없어요.");
            }
        } else if (track.spotify_url) {
            Linking.openURL(track.spotify_url).catch(() =>
                Alert.alert("열기 실패", "Apple Music 앱이 설치되어 있는지 확인해주세요.")
            );
        } else {
            Alert.alert("재생 불가", "미리듣기 및 링크 정보가 없어요.");
        }
    };

    const playlist = diary.playlist && diary.playlist.length > 0 ? diary.playlist : [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}><Text style={styles.headerBtn}>← Back</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                    <Text style={[styles.headerBtn, { color: Colors.primary }]}>{isEditing ? "Done" : "Edit"}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.date}>{diary.date}</Text>
                <Text style={styles.title}>{diary.title} {diary.mood}</Text>

                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        multiline
                        value={editedContent}
                        onChangeText={setEditedContent}
                        autoFocus
                    />
                ) : (
                    <Text style={styles.bodyText}>{diary.content}</Text>
                )}

                <View style={styles.playlistSection}>
                    <Text style={styles.sectionTitle}>Playlist</Text>
                    {playlist.length === 0 ? (
                        <View style={styles.musicBar}>
                            <View style={styles.albumCover}>
                                <Text style={{ fontSize: 20 }}>💿</Text>
                            </View>
                            <View style={styles.musicInfo}>
                                <Text style={styles.musicName}>—</Text>
                                <Text style={styles.artistName}>PathFinder Selection</Text>
                            </View>
                        </View>
                    ) : (
                        playlist.map((track, index) => (
                            <View key={index} style={[styles.musicBar, index < playlist.length - 1 && { marginBottom: 10 }]}>
                                <View style={styles.albumCover}>
                                    {track.cover_url
                                        ? <Image source={{ uri: track.cover_url }} style={styles.albumImage} />
                                        : <Text style={{ fontSize: 20 }}>💿</Text>
                                    }
                                </View>
                                <View style={styles.musicInfo}>
                                    <Text style={styles.musicName}>{track.title}</Text>
                                    <Text style={styles.artistName}>{track.artist}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.playBtn, playingIndex === index && styles.playBtnActive]}
                                    onPress={() => handlePlayPress(track, index)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.playBtnText, playingIndex === index && { color: Colors.primary }]}>
                                        {playingIndex === index ? "⏸" : "▶"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
    headerBtn: { color: Colors.text, fontSize: 16, fontWeight: "600" },
    content: { padding: 24 },
    date: { color: Colors.primary, fontWeight: "700", marginBottom: 10 },
    title: { fontSize: 28, fontWeight: "800", color: Colors.text, marginBottom: 20 },
    bodyText: { fontSize: 18, color: Colors.text, lineHeight: 28, opacity: 0.9 },
    input: { fontSize: 18, color: Colors.text, lineHeight: 28, backgroundColor: Colors.secondary, padding: 15, borderRadius: 15 },

    playlistSection: { marginTop: 40 },
    sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.text, marginBottom: 20 },
    musicBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.secondary,
        padding: 12, borderRadius: 16, borderWidth: 1, borderColor: Colors.border
    },
    albumCover: {
        width: 50, height: 50, borderRadius: 12, backgroundColor: Colors.background,
        justifyContent: 'center', alignItems: 'center', marginRight: 15,
        overflow: 'hidden',
    },
    albumImage: {
        width: 50, height: 50, borderRadius: 12,
    },
    musicInfo: { flex: 1, justifyContent: 'center' },
    musicName: { fontSize: 16, fontWeight: "700", color: Colors.text },
    artistName: { fontSize: 13, color: Colors.subText, marginTop: 2 },
    playBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
        marginLeft: 10,
    },
    playBtnActive: {
        backgroundColor: Colors.secondary,
        borderWidth: 2, borderColor: Colors.primary,
    },
    playBtnText: { color: Colors.secondary, fontSize: 13, fontWeight: '800', marginLeft: 2 },
});
