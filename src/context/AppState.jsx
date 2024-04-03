import AppContext from "./appContext";
import React, { useState } from "react";
const AppState = (props) => {
  const [secretKey, setSecretKey] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [createClassroomDialogue, setCreateClassroomDialogue] = useState(false);
  const [openShareClassroomDialogue, setOpenShareClassroomDialogue] =
    useState(false);
  const [openJoinClassroomDialogue, setOpenJoinClassroomDialogue] =
    useState(false);
  const [classroomData, setClassroomData] = useState(null);
  const [loginState, setLoginState] = useState(2);
  const [DashboardTabsState, setDashboardTabsState] = useState(1);
  const [loadCount, setLoadCount] = useState(1);
  const [quizTabLoadCount, setQuizTabLoadCount] = useState(1);
  const [teacherQuizzesTableState, setTeacherQuizzesTableState] = useState(1);

  const handleClickOpenCreateClassroomDialogue = () => {
    setCreateClassroomDialogue(true);
  };

  const handleCloseCreateClassroomDialogue = () => {
    setCreateClassroomDialogue(false);
  };
  const handleClickOpenShareClassCodeDialogue = () => {
    setOpenShareClassroomDialogue(true);
  };

  const handleClickCloseShareClassCodeDialogue = () => {
    setOpenShareClassroomDialogue(false);
  };
  const handleClickOpenJoinClassroomDialogue = () => {
    setOpenJoinClassroomDialogue(true);
  };
  const handleClickCloseJoinClassroomDialogue = () => {
    setOpenJoinClassroomDialogue(false);
  };

  return (
    <AppContext.Provider
      value={{
        secretKey,
        setSecretKey,

        selectedSubject,
        setSelectedSubject,

        createClassroomDialogue,
        setCreateClassroomDialogue,

        openShareClassroomDialogue,
        setOpenShareClassroomDialogue,
        handleClickOpenShareClassCodeDialogue,
        handleClickCloseShareClassCodeDialogue,

        handleClickOpenCreateClassroomDialogue,
        handleCloseCreateClassroomDialogue,

        openJoinClassroomDialogue,
        setOpenJoinClassroomDialogue,
        handleClickOpenJoinClassroomDialogue,
        handleClickCloseJoinClassroomDialogue,

        classroomData,
        setClassroomData,

        loginState,
        setLoginState,

        DashboardTabsState,
        setDashboardTabsState,

        loadCount,
        setLoadCount,

        quizTabLoadCount,
        setQuizTabLoadCount,

        teacherQuizzesTableState,
        setTeacherQuizzesTableState,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
