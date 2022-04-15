import React from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  const params = useParams();
  const id = params.user_id.toString();
  return (
    <div>
      Profile for user id:
      {id}
    </div>
  );
}

export default Profile;
