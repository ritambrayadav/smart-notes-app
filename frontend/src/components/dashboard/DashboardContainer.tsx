import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/redux/store";
import { fetchAllNotes, searchNotes, deleteNode } from "@/api/notes";
import { markOnboardingSeen, fetchUserByIdAndDispatch } from "@/api/auth";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import NoteSearchInput from "@/components/notes/NoteSearchInput";
import NotesTopBar from "@/components/notes/NotesTopBar";
import NotesGrid from "@/components/notes/NotesGrid";
import PaginationControls from "@/components/common/PaginationControls";
import NoNotesMessage from "@/components/common/NoNotesMessage";
import LoadingNotesMessage from "@/components/common/LoadingNotesMessage";
import { LastKey } from "@/utils/interface";
import Button from "../common/Button";
import { logout } from "@/utils/logout";
import { FiLogOut } from "react-icons/fi";

const DashboardContainer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { notes, loading } = useSelector((state: RootState) => state.notes);
  const { user, fetchedUser } = useSelector((state: RootState) => state.auth);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastKey, setLastKey] = useState<LastKey>();
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const totalPages: number = Math.ceil(notes?.totalPages / limit);

  useEffect(() => {
    if (!user?.userId) return;
    const fetchData = async () => {
      if (searchQuery.trim() !== "") {
        await searchNotes(page, limit, searchQuery);
      } else {
        await fetchAllNotes(page, limit, lastKey);
      }
    };
    fetchData();
  }, [dispatch, page, limit, searchQuery, user?.userId]);

  useEffect(() => {
    if (!fetchedUser && user?.userId) {
      fetchUserByIdAndDispatch(dispatch).catch(() => router.push("/login"));
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

  const handleDelete = async (noteId: string | null | undefined) => {
    await deleteNode(noteId);
    await fetchAllNotes(page, limit, lastKey);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <>
      {showOnboarding && <OnboardingModal onClose={handleOnboardingClose} />}
      <DashboardGreeting userName={user?.userName} />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-5">
        <div className="w-full sm:w-1/5">
          <NotesTopBar />
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

      {!loading && <NotesGrid notes={notes?.notes} onDelete={handleDelete} />}

      {!loading && totalPages >= 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
      <div className="flex justify-end mt-4">
        <Button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
        >
          <FiLogOut />
        </Button>
      </div>
    </>
  );
};

export default DashboardContainer;
