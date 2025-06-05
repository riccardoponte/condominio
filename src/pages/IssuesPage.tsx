import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../services/localStorageService';
import { Modal } from '../components/Modal';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '../components/Icons';
import { Issue, UserProfile, IssueStatus, IssueStatusValues, IssueUrgency } from '../types';

const ISSUES_KEY = 'condo_issues';
const USER_PROFILE_KEY = 'condo_user_profile';

const initialIssueState: Omit<Issue, 'id' | 'reportedDate'> = {
  description: '',
  location: '',
  locationDetails: '',
  photoUrlPlaceholder: '',
  urgency: 'Media',
  priority: 'Media',
  status: IssueStatus.APERTO,
  assignedVendor: '',
  resolutionNotes: ''
};

export const IssuesPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<Partial<Issue>>(initialIssueState);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
   useEffect(() => {
    const profile = getItem(USER_PROFILE_KEY) as UserProfile | null;
    setCurrentUserProfile(profile);
  }, []);
  const isAdmin = currentUserProfile?.isAdmin || false;

  const loadIssues = useCallback(() => {
    const storedIssues = getItem(ISSUES_KEY) as Issue[] | null;
    if (storedIssues) {
      setIssues(storedIssues.sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()));
    } else {
      const exampleIssues: Issue[] = [
        { id: '1', description: 'Luce scale terzo piano non funzionante', location: 'Blocco A, Scale', reportedDate: new Date(2024, 5, 1).toISOString(), status: IssueStatus.APERTO, urgency: 'Media', priority: 'Media', locationDetails: 'Vicino appartamento 3B' },
        { id: '2', description: 'Perdita acqua dal soffitto garage', location: 'Garage, posto auto 12', reportedDate: new Date(2024, 5, 3).toISOString(), status: IssueStatus.IN_ELABORAZIONE, urgency: 'Alta', priority: 'Alta', assignedVendor: 'Idraulico Rossi', photoUrlPlaceholder: 'Foto della perdita disponibile' },
        { id: '3', description: 'Ascensore bloccato al piano terra', location: 'Blocco B, Ascensore', reportedDate: new Date(2024, 4, 20).toISOString(), status: IssueStatus.RISOLTO, urgency: 'Critica', priority: 'Critica', resolutionNotes: 'Riparato da tecnico ascensori il 21/04.', assignedVendor: 'TecnoLift Spa' },
      ];
      setIssues(exampleIssues);
      setItem(ISSUES_KEY, exampleIssues);
    }
  }, []);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const handleSave = () => {
    if (!currentIssue.description || !currentIssue.location || !currentIssue.urgency) {
      alert("Descrizione, luogo e urgenza segnalata sono obbligatori.");
      return;
    }

    let updatedIssues: Issue[];
    if (editingId) {
      updatedIssues = issues.map(iss =>
        iss.id === editingId ? { ...iss, ...currentIssue } as Issue : iss
      );
    } else {
      const newIssue: Issue = {
        id: Date.now().toString(),
        reportedDate: new Date().toISOString(),
        ...initialIssueState,
        ...currentIssue,
        description: currentIssue.description!,
        location: currentIssue.location!,
        urgency: currentIssue.urgency! as IssueUrgency, // Cast because currentIssue.urgency is string
        status: currentIssue.status! // Cast because currentIssue.status is IssueStatusValues
      };
      updatedIssues = [newIssue, ...issues];
    }

    updatedIssues.sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime());
    setIssues(updatedIssues);
    setItem(ISSUES_KEY, updatedIssues);
    setIsModalOpen(false);
    setCurrentIssue(initialIssueState);
    setEditingId(null);
  };

  const openAddModal = () => {
    setCurrentIssue(initialIssueState);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (issue: Issue) => {
    setCurrentIssue({ ...issue });
    setEditingId(issue.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questa segnalazione?")) {
      const updatedIssues = issues.filter(iss => iss.id !== id);
      setIssues(updatedIssues);
      setItem(ISSUES_KEY, updatedIssues);
    }
  };

  const getStatusColor = (status: IssueStatusValues): string => {
    switch (status) {
      case IssueStatus.APERTO: return 'bg-red-100 text-red-700';
      case IssueStatus.IN_ELABORAZIONE: return 'bg-yellow-100 text-yellow-700';
      case IssueStatus.RISOLTO: return 'bg-green-100 text-green-700';
      case IssueStatus.CHIUSO: return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getUrgencyColor = (urgency?: IssueUrgency | string ): string => { // Accept string for broader compatibility if needed
    if (!urgency) return 'text-slate-600';
    switch (urgency) {
      case 'Bassa': return 'text-green-600';
      case 'Media': return 'text-yellow-600';
      case 'Alta': return 'text-orange-600';
      case 'Critica': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const urgencyLevels: IssueUrgency[] = ['Bassa', 'Media', 'Alta', 'Critica'];

  return (
    React.createElement('div', { className: "container mx-auto p-4 animate-fadeIn" },
      React.createElement('div', { className: "flex justify-between items-center mb-6" },
        React.createElement('h2', { className: "text-3xl font-bold text-condo-primary" }, "Segnalazioni Problemi"),
        React.createElement('button', {
          onClick: openAddModal,
          className: "bg-condo-primary hover:bg-condo-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center"
        }, React.createElement(PlusIcon, { className: "w-5 h-5 mr-2"}), "Nuova Segnalazione")
      ),
      issues.length === 0 ? (
        React.createElement('p', { className: "text-slate-600 text-center py-10" }, "Nessuna segnalazione presente.")
      ) : (
        React.createElement('div', { className: "space-y-4" },
          issues.map((iss) => (
            React.createElement('div', { key: iss.id, className: "bg-white p-5 rounded-lg shadow-lg border border-slate-200 hover:shadow-xl transition-shadow" },
              React.createElement('div', { className: "flex justify-between items-start mb-2" },
                React.createElement('h3', { className: "text-lg font-semibold text-condo-dark-text" }, iss.description),
                React.createElement('div', { className: "flex space-x-2" },
                  React.createElement('button', { onClick: () => openEditModal(iss), className: "text-sky-600 hover:text-sky-800", title: "Modifica Segnalazione" },
                    React.createElement(PencilIcon, { className: "w-5 h-5" })
                  ),
                  React.createElement('button', { onClick: () => handleDelete(iss.id), className: "text-red-500 hover:text-red-700", title: "Elimina Segnalazione" },
                    React.createElement(TrashIcon, { className: "w-5 h-5" })
                  )
                )
              ),
              React.createElement('p', { className: "text-sm text-slate-600" }, React.createElement('span', {className:"font-semibold"}, "Luogo:"), ` ${iss.location} ${iss.locationDetails ? `(${iss.locationDetails})` : ''}`),
              React.createElement('p', { className: "text-sm text-slate-600" }, React.createElement('span', {className:"font-semibold"}, "Data Segnalazione:"), ` ${new Date(iss.reportedDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`),
              React.createElement('p', { className: "text-sm" }, React.createElement('span', {className:"font-semibold"}, "Urgenza Segnalata:"), React.createElement('span', {className: `${getUrgencyColor(iss.urgency)} font-medium`}, ` ${iss.urgency}`)),
              iss.priority && React.createElement('p', { className: "text-sm" }, React.createElement('span', {className:"font-semibold"}, "Priorità Admin:"), React.createElement('span', {className: `${getUrgencyColor(iss.priority)} font-medium`}, ` ${iss.priority}`)),
              iss.photoUrlPlaceholder && React.createElement('p', { className: "text-sm text-slate-600 flex items-center" }, React.createElement(PhotoIcon, {className:"w-4 h-4 mr-1 text-slate-500"}), React.createElement('span', {className:"font-semibold"}, "Foto:"), ` ${iss.photoUrlPlaceholder}`),
              iss.assignedVendor && React.createElement('p', { className: "text-sm text-slate-600" }, React.createElement('span', {className:"font-semibold"}, "Fornitore Assegnato:"), ` ${iss.assignedVendor}`),
              React.createElement('div', { className: "mt-3 flex justify-between items-center" },
                React.createElement('span', { className: `px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(iss.status)}` },
                  iss.status
                ),
                iss.status === IssueStatus.RISOLTO && iss.resolutionNotes && React.createElement('p', {className: "text-xs text-slate-500 italic mt-1"}, `Nota: ${iss.resolutionNotes}`)
              )
            )
          ))
        )
      ),
      React.createElement(Modal, { isOpen: isModalOpen, onClose: () => { setIsModalOpen(false); setCurrentIssue(initialIssueState); setEditingId(null); }, title: editingId ? "Modifica Segnalazione" : "Nuova Segnalazione" },
        React.createElement('div', { className: "space-y-4 max-h-[70vh] overflow-y-auto pr-2" },
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "issueDesc", className: "block text-sm font-medium text-slate-700 mb-1" }, "Descrizione Problema*"),
            React.createElement('textarea', {
              id: "issueDesc",
              rows: 3,
              value: currentIssue.description || '',
              onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentIssue({ ...currentIssue, description: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
              required: true
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "issueLocation", className: "block text-sm font-medium text-slate-700 mb-1" }, "Luogo/Area*"),
            React.createElement('input', {
              type: "text",
              id: "issueLocation",
              value: currentIssue.location || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentIssue({ ...currentIssue, location: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
              placeholder: "Es. Ascensore Blocco A",
              required: true
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "issueLocationDetails", className: "block text-sm font-medium text-slate-700 mb-1" }, "Dettagli Posizione"),
            React.createElement('input', {
              type: "text",
              id: "issueLocationDetails",
              value: currentIssue.locationDetails || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentIssue({ ...currentIssue, locationDetails: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
              placeholder: "Es. Vicino porta contatori, Piano 3 Scala B"
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "issuePhoto", className: "block text-sm font-medium text-slate-700 mb-1" }, "Foto (URL o Descrizione)"),
            React.createElement('input', {
              type: "text",
              id: "issuePhoto",
              value: currentIssue.photoUrlPlaceholder || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentIssue({ ...currentIssue, photoUrlPlaceholder: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
              placeholder: "Link a foto o breve descrizione"
            }),
            React.createElement('p', {className: "text-xs text-slate-500 mt-1"}, "Nota: Caricamento file non supportato, inserire un link o descrizione.")
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "issueUrgency", className: "block text-sm font-medium text-slate-700 mb-1" }, "Urgenza Segnalata*"),
            React.createElement('select', {
              id: "issueUrgency",
              value: currentIssue.urgency || 'Media',
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentIssue({ ...currentIssue, urgency: e.target.value as IssueUrgency }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
            },
              urgencyLevels.map(level => React.createElement('option', { key: level, value: level }, level))
            )
          ),

          (isAdmin && editingId) && (
            React.createElement(React.Fragment, null,
              React.createElement('hr', {className: "my-3"}),
              React.createElement('h4', { className: "text-md font-semibold text-condo-primary mb-2" }, "Gestione Amministratore"),
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "issueStatus", className: "block text-sm font-medium text-slate-700 mb-1" }, "Stato"),
                React.createElement('select', {
                  id: "issueStatus",
                  value: currentIssue.status || '',
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentIssue({ ...currentIssue, status: e.target.value as IssueStatusValues }),
                  className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
                },
                  Object.values(IssueStatus).map(status => (
                    React.createElement('option', { key: status, value: status }, status)
                  ))
                )
              ),
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "issuePriority", className: "block text-sm font-medium text-slate-700 mb-1" }, "Priorità (Admin)"),
                React.createElement('select', {
                  id: "issuePriority",
                  value: currentIssue.priority || currentIssue.urgency || 'Media',
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentIssue({ ...currentIssue, priority: e.target.value as IssueUrgency }),
                  className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
                },
                  urgencyLevels.map(level => React.createElement('option', { key: level, value: level }, level))
                )
              ),
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "assignedVendor", className: "block text-sm font-medium text-slate-700 mb-1" }, "Fornitore Assegnato"),
                React.createElement('input', {
                  type: "text",
                  id: "assignedVendor",
                  value: currentIssue.assignedVendor || '',
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentIssue({ ...currentIssue, assignedVendor: e.target.value }),
                  className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
                  placeholder: "Es. Idraulico Mario, Elettricista Srl"
                })
              ),
               React.createElement('div', null,
                React.createElement('label', { htmlFor: "resolutionNotes", className: "block text-sm font-medium text-slate-700 mb-1" }, "Note Risoluzione"),
                React.createElement('textarea', {
                  id: "resolutionNotes",
                  rows: 2,
                  value: currentIssue.resolutionNotes || '',
                  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentIssue({ ...currentIssue, resolutionNotes: e.target.value }),
                  className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
                })
              )
            )
          ),
          React.createElement('div', { className: "flex justify-end space-x-3 pt-2" },
            React.createElement('button', {
                onClick: () => { setIsModalOpen(false); setCurrentIssue(initialIssueState); setEditingId(null); },
                className: "px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition"
            }, "Annulla"),
            React.createElement('button', {
                onClick: handleSave,
                className: "px-4 py-2 text-sm font-medium text-white bg-condo-primary hover:bg-condo-primary-dark rounded-md shadow-sm transition"
            }, editingId ? "Salva Modifiche" : "Invia Segnalazione")
          )
        )
      )
    )
  );
};

export default IssuesPage;
