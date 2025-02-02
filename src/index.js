import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import routes from "./router"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CookiesProvider } from 'react-cookie';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import global_en from './transitions/EN/global.json';
import global_tr from './transitions/TR/global.json';
import ReactGA from "react-ga4";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthProvider } from './context/authContext';

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      global: global_en
    },
    tr: {
      global: global_tr
    }
  }
})




ReactGA.initialize("G-6N1Q7S5NLP");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey="6LdYSzYqAAAAAIP_06LIzEMCkLnlyilaGCslNO_U___"//6LdYSzYqAAAAAIP_06LIzEMCkLnlyilaGCslNO_U
      useEnterprise={false}
      scriptProps={{
        async: false, // optional, default to false,
        defer: false, // optional, default to false
        appendTo: 'body', // optional, default to "head", can be "head" or "body",
        nonce: undefined // optional, default undefined
      }}
    >

      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <I18nextProvider i18n={i18next} >
          <Provider store={store}>
            <AuthProvider>
              <RouterProvider router={routes} />
            </AuthProvider>
          </Provider>
        </I18nextProvider>
      </CookiesProvider>
      <ToastContainer />
    </GoogleReCaptchaProvider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

