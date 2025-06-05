import React from 'react';
import { UsersIcon } from '../components/Icons';
import { Contact } from '../types';

const contactsData: Contact[] = [
  { id: '1', name: 'Mario Rossi', role: 'Amministratore Condominiale', phone: '012-3456789', email: 'amministratore@condominio.it' },
  { id: '2', name: 'Luigi Verdi', role: 'Portiere (Mattina)', phone: '333-1122334' },
  { id: '3', name: 'Giovanna Bianchi', role: 'Portiere (Pomeriggio)', phone: '333-4455667' },
  { id: '4', name: 'Pronto Intervento Idraulico H24', role: 'Idraulico Emergenze', phone: '800-123456' },
  { id: '5', name: 'Servizio Elettricisti Associati', role: 'Elettricista Emergenze', phone: '800-654321' },
  { id: '6', name: 'Manutenzione Ascensori S.r.l.', role: 'Assistenza Ascensori', phone: '02-9876543' },
];

export const ContactsPage = () => {
  return (
    React.createElement('div', { className: "container mx-auto p-4" },
      React.createElement('div', { className: "flex items-center mb-8" },
        React.createElement(UsersIcon, { className: "w-10 h-10 text-condo-primary mr-3"}),
        React.createElement('h2', { className: "text-3xl font-bold text-condo-primary" }, "Contatti Utili")
      ),
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
        contactsData.map((contact) => (
          React.createElement('div', { key: contact.id, className: "bg-white p-6 rounded-lg shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300" },
            React.createElement('h3', { className: "text-xl font-semibold text-condo-dark-text mb-2" }, contact.name),
            React.createElement('p', { className: "text-md text-condo-secondary font-medium mb-3" }, contact.role),
            contact.phone && (
              React.createElement('p', { className: "text-sm text-slate-600 mb-1" },
                React.createElement('span', { className: "font-semibold" }, "Telefono: "), React.createElement('a', { href: `tel:${contact.phone}`, className: "text-condo-primary hover:underline" }, contact.phone)
              )
            ),
            contact.email && (
              React.createElement('p', { className: "text-sm text-slate-600" },
                React.createElement('span', { className: "font-semibold" }, "Email: "), React.createElement('a', { href: `mailto:${contact.email}`, className: "text-condo-primary hover:underline" }, contact.email)
              )
            )
          )
        ))
      ),
      React.createElement('div', { className: "mt-10 p-4 bg-sky-100 border border-sky-300 rounded-lg text-sky-700" },
        React.createElement('h4', { className: "font-semibold text-lg mb-2" }, "Numeri di Emergenza Nazionali"),
        React.createElement('ul', { className: "list-disc list-inside space-y-1" },
          React.createElement('li', null, "Polizia di Stato: ", React.createElement('span', {className: "font-bold"}, "113")),
          React.createElement('li', null, "Carabinieri: ", React.createElement('span', {className: "font-bold"}, "112")),
          React.createElement('li', null, "Vigili del Fuoco: ", React.createElement('span', {className: "font-bold"}, "115")),
          React.createElement('li', null, "Emergenza Sanitaria: ", React.createElement('span', {className: "font-bold"}, "118"))
        )
      )
    )
  );
};

export default ContactsPage;
