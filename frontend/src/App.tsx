import Loading from "@components/loading/Loading";
import DebugBanner from "@containers/debugBanner/DebugBanner";
import Router from "@routes/Router";
import "@shared/i18n";
import "@styles/index.scss";
import { Suspense, useEffect } from "react";
import ReactGA from "react-ga4";
import { ToastContainer } from "react-toastify";

function App() {
  useEffect(() => {
    ReactGA.initialize([
      {
        trackingId: __GA_TRACKING_ID__,
      },
    ]);
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <DebugBanner />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
      />
      <Router />
    </Suspense>
  );
}

export default App;
