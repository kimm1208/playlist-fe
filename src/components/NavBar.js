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
    const NavItem = ({ view, icon, label }) => {
        const isActive = currentView === view;
        return (
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => setCurrentView(view)}
                activeOpacity={0.6}
            >
                <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{icon}</Text>
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
                {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.navBar}>
            <NavItem view="diary"    icon="🏠" label="Home"     />
            <NavItem view="calendar" icon="📅" label="Timeline" />

            {/* 가운데 작성 버튼 */}
            <TouchableOpacity style={styles.navItem} onPress={onWritePress} activeOpacity={0.6}>
                <Text style={styles.navIcon}>✏️</Text>
                <Text style={styles.navLabel}>Write</Text>
            </TouchableOpacity>

            <NavItem view="settings" icon="⚙️" label="Settings" />
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        position: "absolute",
        bottom: 0,
        width: width,
        height: Platform.OS === 'ios' ? 88 : 72,
        paddingBottom: Platform.OS === 'ios' ? 22 : 8,
        backgroundColor: Colors.secondary,
        borderTopWidth: 1,
        borderTopColor: "rgba(63, 255, 178, 0.12)",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 20,
        zIndex: 1000,
    },

    // 일반 탭 아이템 (flex:1로 균등 분할)
    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 52,
        gap: 3,
    },
    navIcon: {
        fontSize: 20,
        opacity: 0.35,
    },
    navIconActive: {
        opacity: 1,
    },
    navLabel: {
        fontSize: 10,
        color: Colors.subText,
        fontWeight: "500",
        opacity: 0.5,
    },
    navLabelActive: {
        color: Colors.primary,
        opacity: 1,
        fontWeight: "700",
    },
    activeDot: {
        width: 3, height: 3,
        borderRadius: 1.5,
        backgroundColor: Colors.primary,
        marginTop: 1,
    },

});
