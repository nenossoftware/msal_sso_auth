# msal-sso-auth

Use SSO authentication in an edge browser

## Installation instructions

```sh
pip install msal-sso-auth
```

## Usage instructions

```python
import streamlit as st

from msal_sso_auth import msal_sso_auth

value = msal_sso_auth()

st.write(value)
```