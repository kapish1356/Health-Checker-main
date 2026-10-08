import React from 'react';

export const DoctorCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col md:flex-row gap-6">
      <div className="w-28 h-28 bg-slate-200 rounded-2xl shrink-0"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
        <div className="h-8 bg-slate-100 rounded-xl w-full"></div>
      </div>
      <div className="w-full md:w-44 flex flex-col justify-between gap-3 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="h-10 bg-slate-200 rounded-2xl w-full"></div>
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
      <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
      <div className="h-5 bg-slate-200 rounded w-2/3"></div>
      <div className="h-3 bg-slate-100 rounded w-full"></div>
      <div className="h-3 bg-slate-100 rounded w-4/5"></div>
      <div className="h-9 bg-slate-100 rounded-xl w-full mt-4"></div>
    </div>
  );
};
