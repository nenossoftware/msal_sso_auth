import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"

import { PublicClientApplication } from '@azure/msal-browser';

interface State {
  accountData: any;
}

const sendAccountIdToStreamlit = (accountData: any) => {
  // Send the accountId back to the Streamlit backend
  Streamlit.setComponentValue({ accountData });
};

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class MsalAuthenticator extends StreamlitComponentBase<State> {
  public componentDidMount = () => {
    // this.hideComponent();

    console.log("Mounting msal instance");

    Streamlit.setComponentReady();

    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.
    const clientId = this.props.args["clientId"];
    const authority = this.props.args["authority"];
    const redirectUri = this.props.args["redirectUri"];

    const msalConfig = {
      auth: {
        clientId: clientId,
        authority: authority,
        redirectUri: redirectUri,
      },
      cache: {
        cacheLocation: 'localStorage', // Or sessionStorage if preferred
        storeAuthStateInCookie: true,
      },
    };

    console.log("initializing msal instance");

    const msalInstance = new PublicClientApplication(msalConfig);

    const handleResponse = (resp: any) => {
      if (resp !== null) {
        let account = resp.account;
        Streamlit.setComponentValue({account: account});
      } else {
        msalInstance.ssoSilent({}).then(() => {
          const currentAccounts = msalInstance.getAllAccounts();
          let account = currentAccounts[0];
          Streamlit.setComponentValue({account: account});
        }).catch(error => {
          console.error("Silent Error: " + error);
          Streamlit.setComponentValue({account: null});
        });
      }
    };

    msalInstance.initialize().then(() => {
      msalInstance.handleRedirectPromise().then(handleResponse).catch(err => {
        console.error(err);
      });
    });
  };

  public render = (): ReactNode => {
    return (
      <div></div>
    );
  }

}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(MsalAuthenticator)
