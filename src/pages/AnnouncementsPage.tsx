import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../services/localStorageService';
import { Modal } from '../components/Modal';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/Icons';
import { Announcement } from '../types'; // Import the Announcement type

const ANNOUNCEMENTS_KEY = 'condo_announcements';

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadAnnouncements = useCallback(() => {
    const storedAnnouncements = getItem(ANNOUNCEMENTS_KEY) as Announcement[] | null;
    if (storedAnnouncements) {
      setAnnouncements(storedAnnouncements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const handleSave = () => {
    if (!currentAnnouncement.title || !currentAnnouncement.content) {
      alert("Titolo e contenuto sono obbligatori.");
      return;
    }

    let updatedAnnouncements: Announcement[];
    if (editingId) {
      updatedAnnouncements = announcements.map(ann =>
        ann.id === editingId ? { ...ann, ...currentAnnouncement, date: new Date().toISOString() } as Announcement : ann
      );
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: currentAnnouncement.title!,
        content: currentAnnouncement.content!,
        date: new Date().toISOString(),
      };
      updatedAnnouncements = [newAnnouncement, ...announcements];
    }

    setAnnouncements(updatedAnnouncements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setItem(ANNOUNCEMENTS_KEY, updatedAnnouncements);
    setIsModalOpen(false);
    setCurrentAnnouncement({});
    setEditingId(null);
  };

  const openAddModal = () => {
    setCurrentAnnouncement({ title: '', content: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (announcement: Announcement) => {
    setCurrentAnnouncement({ ...announcement });
    setEditingId(announcement.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo avviso?")) {
      const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
      setAnnouncements(updatedAnnouncements);
      setItem(ANNOUNCEMENTS_KEY, updatedAnnouncements);
    }
  };

  return (
    React.createElement('div', { className: "container mx-auto p-4" },
      React.createElement('div', { className: "flex justify-between items-center mb-6" },
        React.createElement('h2', { className: "text-3xl font-bold text-condo-primary" }, "Avvisi"),
        React.createElement('button', {
          onClick: openAddModal,
          className: "bg-condo-primary hover:bg-condo-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center"
        }, React.createElement(PlusIcon, { className: "w-5 h-5 mr-2" }), "Nuovo Avviso")
      ),
      announcements.length === 0 ? (
        React.createElement('p', { className: "text-slate-600 text-center py-10" }, "Nessun avviso presente al momento.")
      ) : (
        React.createElement('div', { className: "space-y-4" },
          announcements.map((ann) => (
            React.createElement('div', { key: ann.id, className: "bg-white p-6 rounded-lg shadow-lg border border-slate-200" },
              React.createElement('div', { className: "flex justify-between items-start" },
                React.createElement('div', null,
                  React.createElement('h3', { className: "text-xl font-semibold text-condo-dark-text mb-1" }, ann.title),
                  React.createElement('p', { className: "text-sm text-slate-500 mb-3" }, `Pubblicato il: ${new Date(ann.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}`)
                ),
                React.createElement('div', { className: "flex space-x-2" },
                  React.createElement('button', { onClick: () => openEditModal(ann), className: "text-sky-600 hover:text-sky-800", title: "Modifica Avviso" },
                    React.createElement(PencilIcon, { className: "w-5 h-5" })
                  ),
                  React.createElement('button', { onClick: () => handleDelete(ann.id), className: "text-red-500 hover:text-red-700", title: "Elimina Avviso" },
                    React.createElement(TrashIcon, { className: "w-5 h-5" })
                  )
                )
              ),
              React.createElement('p', { className: "text-slate-700 whitespace-pre-wrap" }, ann.content)
            )
          ))
        )
      ),
      React.createElement(Modal, { isOpen: isModalOpen, onClose: () => { setIsModalOpen(false); setCurrentAnnouncement({}); setEditingId(null); }, title: editingId ? "Modifica Avviso" : "Nuovo Avviso" },
        React.createElement('div', { className: "space-y-4" },
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "title", className: "block text-sm font-medium text-slate-700 mb-1" }, "Titolo"),
            React.createElement('input', {
              type: "text",
              id: "title",
              value: currentAnnouncement.title || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "content", className: "block text-sm font-medium text-slate-700 mb-1" }, "Contenuto"),
            React.createElement('textarea', {
              id: "content",
              value: currentAnnouncement.content || '',
              onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value }),
              rows: 5,
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
            })
          ),
          React.createElement('div', { className: "flex justify-end space-x-3" },
            React.createElement('button', {
              onClick: () => { setIsModalOpen(false); setCurrentAnnouncement({}); setEditingId(null); },
              className: "px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition"
            }, "Annulla"),
            React.createElement('button', {
              onClick: handleSave,
              className: "px-4 py-2 text-sm font-medium text-white bg-condo-primary hover:bg-condo-primary-dark rounded-md shadow-sm transition"
            }, editingId ? "Salva Modifiche" : "Pubblica Avviso")
          )
        )
      )
    )
  );
};

export default AnnouncementsPage;
