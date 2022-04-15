import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../../resources/requests';

function Profile() {
  const [name, setName] = useState('loading ...');

  const params = useParams();
  const id = params.user_id.toString();

  useEffect(() => {
    getRequest(`/api/users/${id}`, (response) => {
      setName(response.name);
    });
  }, [id]);

  return (
    <div>
      {`Profile for user id: ${id}, name: ${name}`}
    </div>
  );
}

export default Profile;
