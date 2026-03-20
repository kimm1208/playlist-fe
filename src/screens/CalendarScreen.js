import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions
} from "react-native";
import { Colors } from "../styles/theme";
import DiaryCard from "../components/DiaryCard";

const { width } = Dimensions.get("window");

export default function CalendarScreen({ diaries }) {
    // 1. 상태 관리
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDiaries, setSelectedDiaries] = useState([]);

    // 2. 달력 데이터 생성 (2026년 3월 기준)
    const year = 2026;
    const month = 2; // March (0-indexed)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

    // 3. 날짜 클릭 핸들러
    const handleDatePress = (day) => {
        const dateObj = { year, month, day };
        setSelectedDate(dateObj);

        // 해당 날짜 일기 필터링
        const filtered = diaries.filter(
            (d) => d.year === year && d.month === month && d.day === day
        );
        setSelectedDiaries(filtered);
    };

    // 4. 개별 날짜 렌더링
    const renderDayItem = (day, isBlank = false) => {
        if (isBlank) return <View style={styles.dayBox} key={`blank-${day}`} />;

        const hasDiary = diaries && diaries.some(
            (d) => d.day === day && d.month === month && d.year === year
        );
        const isSelected = selectedDate && selectedDate.day === day;

        return (
            <TouchableOpacity
                key={day}
                style={styles.dayBox}
                onPress={() => handleDatePress(day)}
                activeOpacity={0.7}
            >
                <View style={[styles.dayTextFrame, isSelected && styles.selectedDayFrame]}>
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                        {day}
                    </Text>
                </View>
                {/* 일기가 있는 날은 민트색 점 표시 (선택 안됐을 때만) */}
                {hasDiary && !isSelected && <View style={styles.dot} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.fullContainer}>
            <FlatList
                data={selectedDiaries}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}

                // 상단 달력 영역
                ListHeaderComponent={
                    <View style={styles.calendarSection}>
                        <Text style={styles.monthText}>{year} / {month + 1}</Text>

                        <View style={styles.daysGrid}>
                            {/* 요일 헤더 */}
                            {weekDays.map((d) => (
                                <Text key={d} style={styles.weekText}>{d}</Text>
                            ))}

                            {/* 날짜 그리드 */}
                            {blanks.map((_, i) => renderDayItem(i, true))}
                            {days.map((day) => renderDayItem(day))}
                        </View>
                    </View>
                }

                // 하단 선택된 날짜의 기록 영역
                renderItem={({ item }) => (
                    <DiaryCard
                        item={item}
                        onPress={(d) => console.log("Detail View:", d)}
                    />
                )}

                // 선택된 날짜가 없을 때나 기록이 없을 때 표시
                ListEmptyComponent={
                    selectedDate ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No records for this day. 📭</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Select a date to see your path. ✨</Text>
                        </View>
                    )
                }

                // 선택된 날짜 타이틀
                ListHeaderComponentStyle={{ marginBottom: 20 }}
                stickyHeaderIndices={[]} // 필요 시 활용
                ListFooterComponent={<View style={{ height: 100 }} />} // 하단 여백
            />

            {/* 선택된 날짜 타이틀 레이어 (달력과 리스트 사이) */}
            {selectedDate && (
                <View style={styles.stickyDateHeader}>
                    <Text style={styles.selectedDateTitle}>
                        {selectedDate.year}.{selectedDate.month + 1}.{selectedDate.day}
                    </Text>
                    <View style={styles.titleLine} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    calendarSection: {
        marginBottom: 20,
    },
    monthText: {
        fontSize: 32,
        fontWeight: "800",
        color: Colors.text,
        letterSpacing: -1.5,
        marginBottom: 30,
    },
    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
    },
    weekText: {
        width: "14.28%",
        textAlign: "center",
        color: Colors.primary, // 민트색 포인트
        fontSize: 10,
        fontWeight: "700",
        marginBottom: 20,
        letterSpacing: 1,
    },
    dayBox: {
        width: "14.28%",
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    dayTextFrame: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    selectedDayFrame: {
        backgroundColor: Colors.secondary, // 딥 네이비
    },
    dayText: {
        fontSize: 16,
        fontWeight: "500",
        color: Colors.text,
    },
    selectedDayText: {
        color: Colors.primary, // 민트색 숫자
        fontWeight: "700",
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.primary,
        position: "absolute",
        bottom: 8,
    },
    // 하단 리스트 섹션
    stickyDateHeader: {
        paddingHorizontal: 24,
        marginBottom: 15,
    },
    selectedDateTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: Colors.text,
        marginBottom: 8,
    },
    titleLine: {
        width: 30,
        height: 4,
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    emptyContainer: {
        paddingVertical: 50,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: Colors.subText,
        fontWeight: "500",
    },
});