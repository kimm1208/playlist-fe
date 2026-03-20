import React, { useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
} from "react-native";

// 스타일 및 공통 컴포넌트
import { Colors } from "./src/styles/theme";
import Header from "./src/components/Header";
import NavBar from "./src/components/NavBar";
import WriteModal from "./src/components/WriteModal";

// 스크린 컴포넌트
import DiaryScreen from "./src/screens/DiaryScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import PlaylistScreen from "./src/screens/PlaylistScreen";
import DetailScreen from "./src/screens/DetailScreen";
import SettingScreen from "./src/screens/SettingScreen";

export default function App() {
  // 1. 기본 내비게이션 상태
  const [currentView, setCurrentView] = useState("diary"); // diary, calendar, playlist, settings
  const [selectedDiary, setSelectedDiary] = useState(null); // 상세 보기를 위한 상태

  // 2. 앱 기능 상태
  const [isWriting, setIsWriting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 3. 일기 데이터 (초기값)
  const [diaries, setDiaries] = useState([
    { id: 1, date: "2026. 03. 13", year: 2026, month: 2, day: 13, mood: "😊", title: "첫 알바 시작", content: "경북대 근처 카페에서 알바를 시작했다. 생각보다 메뉴 외우는 게 어렵지만 재미있다.", album: "💿", music: "Energetic Pop Mix", artist: "Various Artists" },
    { id: 2, date: "2026. 03. 14", year: 2026, month: 2, day: 14, mood: "😐", title: "과제의 늪", content: "IT5호관에서 밤샘 코딩 중... 리액트 네이티브는 알면 알수록 심오하다.", album: "📀", music: "Lofi HipHop", artist: "Chill Study Beats" },
    { id: 3, date: "2026. 03. 15", year: 2026, month: 2, day: 15, mood: "😭", title: "일요일의 끝", content: "내일 월요일이라니 믿기지 않는다. 주말아 돌아와!", album: "🎸", music: "Relaxing Mood", artist: "Acoustic Soul" },
  ]);

  // --- 기능 함수들 ---

  // 일기 저장
  const handleSave = (newEntry) => {
    const selectedDate = new Date(newEntry.date);
    const newItem = {
      id: Date.now(),
      date: selectedDate.toLocaleDateString("ko-KR").replace(/\.$/, ""),
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth(),
      day: selectedDate.getDate(),
      mood: newEntry.mood,
      title: newEntry.title,
      content: newEntry.content,
      album: "🎵",
      music: "New Logged Track",
      artist: "Unknown Artist",
    };
    setDiaries([newItem, ...diaries]);
    setIsWriting(false);
  };

  // 일기 수정 (DetailScreen에서 호출)
  const handleUpdateDiary = (id, newContent) => {
    setDiaries(diaries.map(d => d.id === id ? { ...d, content: newContent } : d));
    // 상세 화면 데이터도 동기화
    setSelectedDiary(prev => prev ? { ...prev, content: newContent } : null);
  };

  // --- 렌더링 컨트롤러 ---

  // 1순위: 상세 화면이 선택되었다면 상세 화면을 전체로 띄움
  if (selectedDiary) {
    return (
      <DetailScreen
        diary={selectedDiary}
        onBack={() => setSelectedDiary(null)}
        onUpdate={handleUpdateDiary}
      />
    );
  }

  return (
    <SafeAreaView style={styles.rootContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.appContainer}>

        {/* 공통 헤더 */}
        <Header
          currentView={currentView}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 메인 콘텐츠 전환 */}
        <View style={{ flex: 1 }}>
          {currentView === "diary" && (
            <DiaryScreen
              diaries={diaries}
              searchQuery={searchQuery}
              onDiaryPress={(diary) => setSelectedDiary(diary)} // 클릭 시 상세 화면으로
            />
          )}

          {currentView === "calendar" && (
            <CalendarScreen
              diaries={diaries}
              onDiaryClick={(diary) => setSelectedDiary(diary)} // 달력 하단 리스트 클릭 시 상세 화면으로
            />
          )}

          {currentView === "playlist" && (
            <PlaylistScreen diaries={diaries} />
          )}
          {currentView === "settings" && <SettingScreen />}
        </View>

        {/* 하단 내비게이션 바 */}
        <NavBar
          currentView={currentView}
          setCurrentView={(view) => {
            setCurrentView(view);
            setIsSearching(false); // 화면 전환 시 검색창 닫기
          }}
          onWritePress={() => setIsWriting(true)}
        />

        {/* 일기 작성 모달 */}
        {isWriting && (
          <WriteModal
            onClose={() => setIsWriting(false)}
            onSave={handleSave}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background // 일렉트릭 미드나잇 배경
  },
  appContainer: {
    flex: 1,
    backgroundColor: Colors.background
  },
});