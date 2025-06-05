import React, { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../services/localStorageService';
import { Modal } from '../components/Modal';
import { PlusIcon, CalendarDaysIcon, TrashIcon } from '../components/Icons';
import { Reservation } from '../types';

const RESERVATIONS_KEY = 'condo_reservations';

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<Partial<Reservation>>({});

  const loadReservations = useCallback(() => {
    const storedReservations = getItem(RESERVATIONS_KEY) as Reservation[] | null;
    if (storedReservations) {
      setReservations(storedReservations.sort((a,b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()));
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleSave = () => {
    if (!currentReservation.amenity || !currentReservation.userName || !currentReservation.date || !currentReservation.time) {
      alert("Tutti i campi sono obbligatori per la prenotazione.");
      return;
    }
    const newReservation: Reservation = {
      id: Date.now().toString(),
      amenity: currentReservation.amenity!,
      userName: currentReservation.userName!,
      date: currentReservation.date!,
      time: currentReservation.time!,
    };
    const updatedReservations = [...reservations, newReservation].sort((a,b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
    setReservations(updatedReservations);
    setItem(RESERVATIONS_KEY, updatedReservations);
    setIsModalOpen(false);
    setCurrentReservation({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Sei sicuro di voler cancellare questa prenotazione?")) {
      const updatedReservations = reservations.filter(res => res.id !== id);
      setReservations(updatedReservations);
      setItem(RESERVATIONS_KEY, updatedReservations);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    React.createElement('div', { className: "container mx-auto p-4" },
      React.createElement('div', { className: "flex justify-between items-center mb-6" },
        React.createElement('h2', { className: "text-3xl font-bold text-condo-primary" }, "Prenotazioni Aree Comuni"),
        React.createElement('button', {
          onClick: () => { setCurrentReservation({ date: today }); setIsModalOpen(true); },
          className: "bg-condo-primary hover:bg-condo-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center"
        }, React.createElement(PlusIcon, { className: "w-5 h-5 mr-2" }), "Nuova Prenotazione")
      ),
      reservations.length === 0 ? (
        React.createElement('p', { className: "text-slate-600 text-center py-10" }, "Nessuna prenotazione attiva.")
      ) : (
        React.createElement('div', { className: "space-y-4" },
          reservations.map((res) => (
            React.createElement('div', { key: res.id, className: "bg-white p-5 rounded-lg shadow-lg border border-slate-200" },
              React.createElement('div', { className: "flex items-center text-condo-secondary mb-2" },
                React.createElement(CalendarDaysIcon, { className: "w-6 h-6 mr-2"}),
                React.createElement('h3', { className: "text-lg font-semibold text-condo-dark-text" }, res.amenity)
              ),
              React.createElement('p', { className: "text-sm text-slate-700" }, "Prenotato da: ", React.createElement('span', {className: "font-medium"}, res.userName)),
              React.createElement('p', { className: "text-sm text-slate-700" }, "Data: ", React.createElement('span', {className: "font-medium"}, new Date(res.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' }))),
              React.createElement('p', { className: "text-sm text-slate-700" }, "Ora: ", React.createElement('span', {className: "font-medium"}, res.time)),
              React.createElement('div', { className: "mt-3 text-right" },
                React.createElement('button', { onClick: () => handleDelete(res.id), className: "text-red-500 hover:text-red-700", title: "Cancella Prenotazione" },
                  React.createElement(TrashIcon, { className: "w-5 h-5" })
                )
              )
            )
          ))
        )
      ),
      React.createElement(Modal, { isOpen: isModalOpen, onClose: () => { setIsModalOpen(false); setCurrentReservation({});}, title: "Effettua Prenotazione" },
        React.createElement('div', { className: "space-y-4" },
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "resAmenity", className: "block text-sm font-medium text-slate-700 mb-1" }, "Area/Servizio"),
            React.createElement('input', {
              type: "text",
              id: "resAmenity",
              value: currentReservation.amenity || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentReservation({ ...currentReservation, amenity: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary",
              placeholder: "Es. Sala Feste, Campo da Tennis"
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "resUserName", className: "block text-sm font-medium text-slate-700 mb-1" }, "Nome Prenotante"),
            React.createElement('input', {
              type: "text",
              id: "resUserName",
              value: currentReservation.userName || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentReservation({ ...currentReservation, userName: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "resDate", className: "block text-sm font-medium text-slate-700 mb-1" }, "Data"),
            React.createElement('input', {
              type: "date",
              id: "resDate",
              value: currentReservation.date || today,
              min: today,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentReservation({ ...currentReservation, date: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "resTime", className: "block text-sm font-medium text-slate-700 mb-1" }, "Ora"),
            React.createElement('input', {
              type: "time",
              id: "resTime",
              value: currentReservation.time || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentReservation({ ...currentReservation, time: e.target.value }),
              className: "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-condo-primary focus:border-condo-primary"
            })
          ),
          React.createElement('div', { className: "flex justify-end space-x-3" },
            React.createElement('button', {
                onClick: () => { setIsModalOpen(false); setCurrentReservation({}); },
                className: "px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition"
            }, "Annulla"),
            React.createElement('button', {
                onClick: handleSave,
                className: "px-4 py-2 text-sm font-medium text-white bg-condo-primary hover:bg-condo-primary-dark rounded-md shadow-sm transition"
            }, "Conferma Prenotazione")
          )
        )
      )
    )
  );
};

export default ReservationsPage;
