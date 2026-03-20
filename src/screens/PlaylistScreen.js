import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Colors } from "../styles/theme";

export default function PlaylistScreen({ diaries }) {
    return (
        <View style={styles.container}>
            <FlatList
                data={diaries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.musicItem}>
                        <Text style={styles.albumArt}>{item.album}</Text>
                        <View style={styles.musicInfo}>
                            <Text style={styles.musicTitle}>{item.music}</Text>
                            <Text style={styles.musicSub}>{item.date} - {item.title}</Text>
                        </View>
                        <Text style={{ fontSize: 20 }}>▶️</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    musicItem: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", padding: 15, borderRadius: 15, marginBottom: 10
    },
    albumArt: { fontSize: 30, marginRight: 15 },
    musicInfo: { flex: 1 },
    musicTitle: { fontSize: 16, fontWeight: "bold", color: Colors.text },
    musicSub: { fontSize: 12, color: Colors.secondary }
});