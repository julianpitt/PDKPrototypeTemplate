import { CognitoAuth } from '@aws-northstar/ui';
import React, { useContext } from 'react';
import Config from '../../config.json';
import { RuntimeConfigContext } from '../../context/RuntimeContext';

const Auth: React.FC<any> = ({ children }) => {
  const runtimeContext = useContext(RuntimeConfigContext);

  return runtimeContext?.userPoolId &&
    runtimeContext?.userPoolWebClientId &&
    runtimeContext?.region &&
    runtimeContext?.identityPoolId ? (
    <CognitoAuth
      header={Config.applicationName}
      userPoolId={runtimeContext.userPoolId}
      clientId={runtimeContext.userPoolWebClientId}
      region={runtimeContext.region}
      identityPoolId={runtimeContext.identityPoolId}
    >
      {children}
    </CognitoAuth>
  ) : (
    <></>
  );
};

export default Auth;
