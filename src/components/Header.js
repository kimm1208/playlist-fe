// src/components/Header.js
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Colors } from "../styles/theme";

export default function Header({ currentView, isSearching, setIsSearching, searchQuery, setSearchQuery }) {
    const getTitle = () => {
        switch (currentView) {
            case "diary": return "Home";
            case "calendar": return "Timeline";
            case "playlist": return "Music";
            default: return "DiaryMusic";
        }
    };

    return (
        <View style={styles.header}>
            {!isSearching ? (
                <>
                    <Text style={styles.headerTitle}>{getTitle()}</Text>
                    <TouchableOpacity style={styles.searchBtn} onPress={() => setIsSearching(true)}>
                        <Text style={styles.searchIcon}>🔍</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={styles.searchWrapper}>
                    <Text style={styles.searchIconInside}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        autoFocus
                        placeholder="Search your story..."
                        placeholderTextColor={Colors.subText}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(""); }}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        paddingHorizontal: 24,
        height: 90,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.background,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800", // 더 두껍게
        color: Colors.text,
        letterSpacing: -1, // 글자 간격 좁게
    },
    searchBtn: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: Colors.card, justifyContent: "center",
        alignItems: "center",
    },
    searchIcon: { fontSize: 18, color: Colors.text },
    searchWrapper: {
        flex: 1, flexDirection: "row", alignItems: "center",
        backgroundColor: Colors.card, borderRadius: 12, paddingHorizontal: 15, height: 48,
    },
    searchIconInside: { fontSize: 16, color: Colors.subText, marginRight: 10 },
    searchInput: { flex: 1, height: 48, color: Colors.text, fontSize: 15 },
    closeIcon: { fontSize: 18, color: Colors.subText, marginLeft: 10 },
});