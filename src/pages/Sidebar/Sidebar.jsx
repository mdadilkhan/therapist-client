import React from 'react';
import ClientSidebar from '../../components/ClientSidebar';
import TherapistSidebar from '../../components/TherapistSidebar';

const Sidebar = ({ role }) => {

  return (
    <>
      {role == "therapist" ? (
        <TherapistSidebar />
      ) : (
        <ClientSidebar />
      )}
    </>
  );
}

export default Sidebar;
