"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/redux/store";
import { fetchAllNotes, searchNotes, deleteNode } from "@/api/notes";
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
  const { notes, loading } = useSelector((state: RootState) => state.notes);
  const { user, fetchedUser } = useSelector((state: RootState) => state.auth);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastKey, setLastKey] = useState({});
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const totalPages = Math.ceil(notes?.totalPages / limit);
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      if (searchQuery.trim() !== "") {
        await searchNotes(page, limit, searchQuery);
      } else {
        await fetchAllNotes(page, limit, lastKey);
      }
    };
    fetchData();
  }, [dispatch, page, limit, searchQuery, user?.userId]);

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
      setLastKey(notes?.lastKey);
      setShowOnboarding(!fetchedUser.hasSeenOnboarding);
    }
  }, [fetchedUser, notes]);

  const handleOnboardingClose = async () => {
    await markOnboardingSeen();
    setShowOnboarding(false);
  };

  const handleCreateNote = () => {
    router.push("/notes/create-update");
  };

  const handleEditNote = (noteId: string | null | undefined) => {
    router.push(`/notes/create-update?noteId=${noteId}`);
  };
  const handleDelete = async (noteId: string | null | undefined) => {
    deleteNode(noteId);
    await fetchAllNotes(page, limit, lastKey);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {showOnboarding && <OnboardingModal onClose={handleOnboardingClose} />}
        <DashboardGreeting userName={user?.userName} />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-5 ">
          <div className="w-full sm:w-1/5">
            <NotesTopBar
              totalNotes={totalPages}
              filteredCount={notes?.notes?.length}
              handleCreateNote={handleCreateNote}
            />
          </div>
          <div className="w-full sm:w-4/5">
            <NoteSearchInput
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
          </div>
        </div>
        {loading && <LoadingNotesMessage />}
        {!loading && notes?.notes?.length === 0 && <NoNotesMessage />}

        {!loading && (
          <NotesGrid
            notes={notes?.notes}
            onEdit={handleEditNote}
            onDelete={handleDelete}
          />
        )}
        {!loading && totalPages >= 1 && (
          <PaginationControls
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
