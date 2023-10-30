import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Cards } from '../../../Components/Card/Cards';

export const Companies = () => {
  const history = useHistory();
  const state = useSelector((state) => state);
  const allUsers = state?.allUsers;

  useEffect(() => {
    if (state?.currentUser?.role !== 'Student') {
      return history.push('/');
    }
  }, [history, state?.currentUser?.role]);

  let companies = [];
  // eslint-disable-next-line
  Object.values(allUsers).map((item) => {
    if (item?.role === 'Company') {
      companies.push(item);
    }
    return null; // return null to satisfy array-callback-return
  });

  return (
    <div style={{ width: '100%', marginTop: '5em' }}>
      <h3 style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5em' ,color : '#fff'}}>List of companies here</h3>
      <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {companies.map((item, index) => (
          <Cards title={item?.fullName} text={item?.profile} email={item?.email} key={index} />
        ))}
      </div>
    </div>
  );
};
