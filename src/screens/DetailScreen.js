import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { Colors } from "../styles/theme";

export default function DetailScreen({ diary, onBack, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(diary.content);

    const handleSave = () => {
        onUpdate(diary.id, editedContent);
        setIsEditing(false);
    };

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
                    {/* 가로 바 형태의 플레이리스트 */}
                    <View style={styles.musicBar}>
                        <View style={styles.albumCover}>
                            <Text style={{ fontSize: 20 }}>💿</Text>
                        </View>
                        <View style={styles.musicInfo}>
                            <Text style={styles.musicName}>{diary.music}</Text>
                            <Text style={styles.artistName}>PathFinder Selection</Text>
                        </View>
                    </View>
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
        justifyContent: 'center', alignItems: 'center', marginRight: 15
    },
    musicInfo: { flex: 1, justifyContent: 'center' },
    musicName: { fontSize: 16, fontWeight: "700", color: Colors.text },
    artistName: { fontSize: 13, color: Colors.subText, marginTop: 2 }
});