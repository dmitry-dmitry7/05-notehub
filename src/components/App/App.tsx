import css from './App.module.css';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import { fetchNotes } from '../../services/noteService';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = useDebouncedCallback(setSearchQuery, 300);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['notes', searchQuery, page],
    queryFn: () => fetchNotes(searchQuery, page),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox text={searchQuery} onSearch={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            onPageChange={setPage}
            currentPage={page}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <strong>Loading tasks...</strong>}

      {data && !isLoading && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onAddForm={closeModal} />
        </Modal>
      )}
    </div>
  );
}
