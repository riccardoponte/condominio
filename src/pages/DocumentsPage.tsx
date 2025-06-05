import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../services/localStorageService';
import { Modal } from '../components/Modal';
import { PlusIcon, DocumentTextIcon, TrashIcon, TagIcon } from '../components/Icons';
import { Document as DocumentType } from '../types'; // Renaming imported Document to DocumentType

const DOCUMENTS_KEY = 'condo_documents';

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Partial<DocumentType>>({ name: '', type: '', tags: [] });
  const [tagsInput, setTagsInput] = useState('');

  const loadDocuments = useCallback(() => {
    const storedDocuments = getItem(DOCUMENTS_KEY) as DocumentType[] | null;
    if (storedDocuments) {
      setDocuments(storedDocuments.sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
    } else {
      const exampleDocs: DocumentType[] = [
        { id: '1', name: 'Regolamento Condominiale 2024', type: 'PDF', uploadDate: new Date(2024,0,15).toISOString(), url: '#', tags: ['regolamento', 'ufficiale'] },
        { id: '2', name: 'Verbale Assemblea Gennaio 2024', type: 'PDF', uploadDate: new Date(2024,0,30).toISOString(), url: '#', tags: ['verbale', 'assemblea'] },
        { id: '3', name: 'Bilancio Consuntivo 2023', type: 'XLSX', uploadDate: new Date(2024,2,10).toISOString(), url: '#', tags: ['bilancio', 'finanze'] },
      ];
      setDocuments(exampleDocs);
      setItem(DOCUMENTS_KEY, exampleDocs);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSave = () => {
    if (!currentDocument.name || !currentDocument.type) {
      alert("Nome del documento e tipo sono obbligatori.");
      return;
    }
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const newDocument: DocumentType = {
      id: Date.now().toString(),
      name: currentDocument.name!,
      type: currentDocument.type!,
      tags: tagsArray,
      uploadDate: new Date().toISOString(),
      url: '#' // Placeholder URL
    };

    const updatedDocuments = [newDocument, ...documents].sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    setDocuments(updatedDocuments);
    setItem(DOCUMENTS_KEY, updatedDocuments);
    setIsModalOpen(false);
    setCurrentDocument({ name: '', type: '', tags: [] });
    setTagsInput('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo documento?")) {
      const updatedDocuments = documents.filter(doc => doc.id !== id);
      setDocuments(updatedDocuments);
      setItem(DOCUMENTS_KEY, updatedDocuments);
    }
  };

  const openAddModal = () => {
    setCurrentDocument({ name: '', type: '', tags: [] });
    setTagsInput('');
    setIsModalOpen(true);
  }

  return (
    React.createElement('div', { className: "container mx-auto p-4 animate-fadeIn" },
      React.createElement('div', { className: "flex justify-between items-center mb-6" },
        React.createElement('h2', { className: "text-3xl font-bold text-condo-primary" }, "Documenti Condominiali"),
        React.createElement('button', {
          onClick: openAddModal,
          className: "bg-condo-primary hover:bg-condo-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center"
        }, React.createElement(PlusIcon, { className: "w-5 h-5 mr-2" }), "Aggiungi Documento")
      ),
      documents.length === 0 ? (
        React.createElement('p', { className: "text-slate-600 text-center py-10" }, "Nessun documento caricato.")
      ) : (
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
          documents.map((doc) => (
            React.createElement('div', { key: doc.id, className: "bg-white p-5 rounded-lg shadow-lg border border-slate-200 flex flex-col justify-between hover:shadow-xl transition-shadow" },
              React.createElement('div', null,
                React.createElement('div', { className: "flex items-center text-condo-secondary mb-3" },
                  React.createElement(DocumentTextIcon, { className: "w-8 h-8 mr-3"}),
                  React.createElement('h3', { className: "text-lg font-semibold text-condo-dark-text truncate", title: doc.name }, doc.name)
                ),
                React.createElement('p', { className: "text-sm text-slate-600 mb-1" }, "Tipo: ", React.createElement('span', {className: "font-medium"}, doc.type)),
                React.createElement('p', { className: "text-xs text-slate-500 mb-3" }, `Caricato il: ${new Date(doc.uploadDate).toLocaleDateString('it-IT')}`),
                doc.tags && doc.tags.length > 0 && (
                  React.createElement('div', { className: "mb-3" },
                    React.createElement('span', { className: "text-xs text-slate-500 flex items-center" }, React.createElement(TagIcon, {className: "w-4 h-4 mr-1 text-slate-400"}), " Tags:"),
                    React.createElement('div', { className: "flex flex-wrap gap-1 mt-1" },
                      doc.tags.map(tag => (
                        React.createElement('span', { key: tag, className: "px-2 py-0.5 text-xs bg-sky-100 text-sky-700 rounded-full" }, tag)
                      ))
                    )
                  )
                )
              ),
              React.createElement('div', { className: "flex justify-between items-center mt-4" },
                React.createElement('a', {
                  href: doc.url || '#',
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-sm text-condo-primary hover:underline disabled:opacity-50",
                  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => { if (!doc.url || doc.url === '#') { e.preventDefault(); alert("Nessun file allegato (simulazione).");} }
                }, "Visualizza/Scarica"),
                React.createElement('button', { onClick: () => handleDelete(doc.id), className: "text-red-500 hover:text-red-700", title: "Elimina Documento" },
                  React.createElement(TrashIcon, { className: "w-5 h-5" })
                )
              )
            )
          ))
        )
      ),
      React.createElement(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), title: "Aggiungi Nuovo Documento" },
        React.createElement('div', { className: "space-y-4" },
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "docName", className: "block text-sm font-medium text-slate-700 mb-1" }, "Nome Documento"),
            React.createElement('input', {
              type: "text",
              id: "docName",
              value: currentDocument.name || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentDocument({ ...currentDocument, name: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
              placeholder: "Es. Verbale Assemblea Aprile 2024"
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "docType", className: "block text-sm font-medium text-slate-700 mb-1" }, "Tipo Documento"),
            React.createElement('input', {
              type: "text",
              id: "docType",
              value: currentDocument.type || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentDocument({ ...currentDocument, type: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
              placeholder: "Es. PDF, Regolamento, Fattura"
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "docTags", className: "block text-sm font-medium text-slate-700 mb-1" }, "Tags (separati da virgola)"),
            React.createElement('input', {
              type: "text",
              id: "docTags",
              value: tagsInput,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
              placeholder: "Es. importante, verbale, bilancio"
            })
          ),
          React.createElement('p', { className: "text-xs text-slate-500" }, "Nota: La funzionalità di upload file è simulata. Verrà salvato solo il riferimento al documento."),
          React.createElement('div', { className: "flex justify-end space-x-3" },
             React.createElement('button', {
              onClick: () => { setIsModalOpen(false); setCurrentDocument({}); setTagsInput(''); },
              className: "px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition"
            }, "Annulla"),
            React.createElement('button', {
              onClick: handleSave,
              className: "px-4 py-2 text-sm font-medium text-white bg-condo-primary hover:bg-condo-primary-dark rounded-md shadow-sm transition"
            }, "Aggiungi Documento")
          )
        )
      )
    )
  );
};

export default DocumentsPage;
