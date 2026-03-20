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
  const [writeInitialDate, setWriteInitialDate] = useState(null); // 달력에서 날짜 찍어서 열 때 사용
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 3. 일기 데이터 (초기값)
  // playlist: [{ title, artist, cover_url, spotify_url, preview_url }]
  const [diaries, setDiaries] = useState([]);

  // --- 기능 함수들 ---

  // 일기 저장 (WriteModal에서 이미 API 호출 후 playlist가 포함된 entry를 전달)
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
      weather: newEntry.weather || "맑음",
      tags: newEntry.tags || [],
      playlist: newEntry.playlist || [],
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
              onDiaryPress={(diary) => setSelectedDiary(diary)}
            />
          )}

          {currentView === "calendar" && (
            <CalendarScreen
              diaries={diaries}
              onDiaryClick={(diary) => setSelectedDiary(diary)}
              onWritePress={(dateString) => {
                setWriteInitialDate(dateString);
                setIsWriting(true);
              }}
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
            onClose={() => { setIsWriting(false); setWriteInitialDate(null); }}
            onSave={handleSave}
            initialDate={writeInitialDate}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
