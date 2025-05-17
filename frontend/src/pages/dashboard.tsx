"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/redux/store";
import { fetchAllNotes, searchNotes } from "@/api/notes";
import { markOnboardingSeen, fetchUserByIdAndDispatch } from "@/api/auth";
import OnboardingModal from "@/components/OnboardingModal";
import DashboardGreeting from "@/components/DashboardGreeting";
import NoteSearchInput from "@/components/NoteSearchInput";
import NotesTopBar from "@/components/NotesTopBar";
import NotesGrid from "@/components/NotesGrid";
import PaginationControls from "@/components/PaginationControls";
import NoNotesMessage from "@/components/NoNotesMessage";
import LoadingNotesMessage from "@/components/LoadingNotesMessage";

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { notes, loading, totalCount } = useSelector(
    (state: RootState) => state.notes
  );
  const { user, fetchedUser } = useSelector((state: RootState) => state.auth);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);

  const totalPages = Math.ceil(totalCount / limit);

  // 🔍 Fetch Notes on load and on page change or search
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;

      if (searchQuery.trim() !== "") {
        await searchNotes(dispatch, searchQuery, page, limit);
      } else {
        await fetchAllNotes(dispatch, page, limit);
      }
    };

    fetchData();
  }, [dispatch, page, limit, searchQuery, user?.userId]);

  // 👤 Fetch user once
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await fetchUserByIdAndDispatch(dispatch);
      } catch {
        router.push("/login");
      }
    };

    if (!fetchedUser && user?.userId) {
      fetchUser();
    }
  }, [dispatch, router, user?.userId, fetchedUser]);

  useEffect(() => {
    if (fetchedUser) {
      setShowOnboarding(!fetchedUser.hasSeenOnboarding);
    }
  }, [fetchedUser]);

  const handleOnboardingClose = async () => {
    await markOnboardingSeen(dispatch);
    setShowOnboarding(false);
  };

  const handleCreateNote = () => {
    router.push("/notes/create-update");
  };

  const handleEditNote = (noteId: string) => {
    router.push(`/notes/edit/${noteId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); 
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* {showOnboarding && <OnboardingModal onClose={handleOnboardingClose} />} */}

        <DashboardGreeting userName={user?.userName} />

        <NoteSearchInput
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />

        <NotesTopBar
          totalNotes={totalCount}
          filteredCount={notes.length}
          handleCreateNote={handleCreateNote}
        />

        {loading && <LoadingNotesMessage />}
        {!loading && notes.length === 0 && <NoNotesMessage />}

        {!loading &&
          notes.map((note) => (
            <NotesGrid
              key={note.noteId}
              notes={note}
              handleEditNote={handleEditNote}
            />
          ))}

        {!loading && totalPages > 1 && (
          <PaginationControls
            page={page}
            totalPages={totalPages}
            // setPage={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
