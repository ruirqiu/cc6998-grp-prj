import React from 'react'
import Search from './components/Search/Search'

import Amplify from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

Amplify.configure({
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_uGN49fe9X",
  aws_user_pools_web_client_id: "4ps8s9a7a67uqk62d49vsajs4j",
  aws_cognito_identity_pool_id: "us-east-1:c1f5036f-8d71-49ac-9e87-d68ea080b9c5",
  aws_mandatory_sign_in: "enable"
});

function App() {
  return (
    <>
      <AmplifySignOut />
      <Search />
    </>

  );
}

export default withAuthenticator(App);
