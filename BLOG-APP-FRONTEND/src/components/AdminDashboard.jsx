import React from 'react';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText, mutedText,
  cardClass, headingClass, primaryBtn, secondaryBtn, divider
} from '../styles/common';

const AdminDashboard = () => {
  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className={pageTitleClass}>Admin Panel</h1>
            <p className={bodyText + " mt-2"}>Managing 342 users · 18 pending</p>
          </div>
          <button className={primaryBtn}>Send Announcement</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            { label: 'Total Users', val: '342' },
            { label: 'Authors', val: '48' },
            { label: 'Articles', val: '156' },
            { label: 'Pending', val: '18' },
          ].map((stat) => (
            <div key={stat.label} className={cardClass + " text-center"}>
              <p className={mutedText + " mb-1"}>{stat.label}</p>
              <p className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className={divider}></div>

        {/* Moderation Queue */}
        <div>
          <h2 className={headingClass + " mb-6"}>Moderation Queue</h2>
          <div className="space-y-3">
            <div className={cardClass + " flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"}>
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight">Building Scalable Microservices</h3>
                <p className={mutedText + " mt-1"}>Submitted by @tech_wizard · High Priority</p>
              </div>
              <div className="flex gap-2">
                <button className={primaryBtn}>Approve</button>
                <button className={secondaryBtn + " text-[#cc2f26] border-[#cc2f26]/30 hover:bg-[#ff3b30]/5"}>Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
