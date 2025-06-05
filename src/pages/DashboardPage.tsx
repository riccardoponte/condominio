import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, DocumentTextIcon, WrenchScrewdriverIcon, CalendarDaysIcon, UsersIcon } from '../components/Icons';

interface DashboardCardProps {
  title: string;
  description: string;
  linkTo: string;
  icon: ReactElement; // React.ReactElement is more specific for JSX elements
  bgColor: string;
  textColor: string;
}

const DashboardCard = ({ title, description, linkTo, icon, bgColor, textColor }: DashboardCardProps) => (
  React.createElement(Link, { to: linkTo, className: `block p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${bgColor} ${textColor}` },
    React.createElement('div', { className: "flex items-center mb-3" },
      React.cloneElement(icon, { className: "w-8 h-8 mr-3" }), // Ensure icon is cloned to add className
      React.createElement('h3', { className: "text-xl font-semibold" }, title)
    ),
    React.createElement('p', { className: "text-sm opacity-90" }, description)
  )
);

export const DashboardPage = () => {
  const cards: DashboardCardProps[] = [
    { title: "Avvisi Recenti", description: "Leggi gli ultimi avvisi e comunicazioni.", linkTo: "/avvisi", icon: React.createElement(BellIcon, {}), bgColor: "bg-sky-500", textColor: "text-white" },
    { title: "Documenti Utili", description: "Accedi a regolamenti, verbali e altri documenti.", linkTo: "/documenti", icon: React.createElement(DocumentTextIcon, {}), bgColor: "bg-emerald-500", textColor: "text-white" },
    { title: "Segnala un Problema", description: "Invia una segnalazione per guasti o manutenzioni.", linkTo: "/segnalazioni", icon: React.createElement(WrenchScrewdriverIcon, {}), bgColor: "bg-amber-500", textColor: "text-condo-dark-text" },
    { title: "Prenota Spazi Comuni", description: "Verifica disponibilità e prenota sale o attrezzature.", linkTo: "/prenotazioni", icon: React.createElement(CalendarDaysIcon, {}), bgColor: "bg-indigo-500", textColor: "text-white" },
    { title: "Contatti di Emergenza", description: "Trova numeri utili per amministrazione e servizi.", linkTo: "/contatti", icon: React.createElement(UsersIcon, {}), bgColor: "bg-rose-500", textColor: "text-white" },
  ];

  return (
    React.createElement('div', { className: "animate-fadeIn" },
      React.createElement('h2', { className: "text-3xl font-bold text-condo-primary mb-8" }, "Bacheca Condominiale"),
      React.createElement('p', { className: "text-lg text-condo-text mb-10" },
        "Benvenuto nell'area riservata del tuo condominio. Qui puoi trovare tutte le informazioni e i servizi utili."
      ),
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
        cards.map(card => React.createElement(DashboardCard, { key: card.title, ...card }))
      )
    )
  );
};

export default DashboardPage;
