import React from 'react';
import ClientSidebar from '../../components/ClientSidebar';
import TherapistSidebar from '../../components/TherapistSidebar';

const Sidebar = ({ role }) => {

  return (
    <>
      {role == "therapist" ? (
        <TherapistSidebar />
      ) : role=="user" ? (
        <ClientSidebar />
      ) : null
    }
    </>
  );
}

export default Sidebar;
