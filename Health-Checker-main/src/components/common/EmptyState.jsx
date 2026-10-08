import React from 'react';
import { Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria at the moment.',
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-xs max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-800 mb-1.5">{title}</h4>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{description}</p>
      
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl health-gradient text-white font-bold text-sm shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
        >
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && !actionLink && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl health-gradient text-white font-bold text-sm shadow-md shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
