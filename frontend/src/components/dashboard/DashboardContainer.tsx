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
import { last } from "lodash";

const DashboardContainer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { notes, loading } = useSelector((state: RootState) => state.notes);
  const { user, fetchedUser } = useSelector((state: RootState) => state.auth);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastKeys, setLastKeys] = useState<{ [page: number]: LastKey | null }>({
    1: null,
  });
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const totalPages: number = Math.ceil(notes?.totalPages / limit);

  const fetchData = async () => {
    const keyForPage = lastKeys[page] || null;
    let response;
    if (searchQuery.trim() !== "") {
      await searchNotes(page, limit, searchQuery);
      return;
    } else {
      response = await fetchAllNotes(page, limit, JSON.stringify(keyForPage));
    }
    const newLastKey =
      typeof response?.lastKey === "string"
        ? JSON.parse(response.lastKey)
        : response?.lastKey;
    if (
      newLastKey?.userId &&
      newLastKey?.noteId &&
      !Object.prototype.hasOwnProperty.call(lastKeys, page + 1)
    ) {
      setLastKeys((prev) => ({
        ...prev,
        [page + 1]: newLastKey,
      }));
    }
  };

  useEffect(() => {
    if (!user?.userId || !fetchedUser) return;

    const shouldFetch =
      page === 1 || Object.prototype.hasOwnProperty.call(lastKeys, page);

    if (!shouldFetch) {
      return;
    }

    fetchData();
  }, [page, lastKeys, searchQuery, user?.userId, fetchedUser]);

  useEffect(() => {
    if (!fetchedUser && user?.userId) {
      fetchUserByIdAndDispatch(dispatch);
    }
  }, [dispatch, router, user?.userId, showOnboarding]);

  useEffect(() => {
    if (fetchedUser) {
      setShowOnboarding((prev) => {
        if (prev !== undefined) return prev;
        return !fetchedUser.hasSeenOnboarding;
      });
    }
  }, [fetchedUser]);

  const handleOnboardingClose = async () => {
    await markOnboardingSeen();
    setShowOnboarding(false);
  };

  const handleDelete = async (noteId: string | null | undefined) => {
    await deleteNode(noteId);
    const keyForPage = lastKeys[page] || null;
    await fetchAllNotes(page, limit, keyForPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setLastKeys({ 1: null });
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
